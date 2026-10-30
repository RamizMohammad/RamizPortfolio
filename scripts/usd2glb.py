"""
Convert a NVIDIA SimReady USD asset to a binary glTF (GLB).

Reads every mesh (including instance proxies), splits it by its material GeomSubsets, triangulates,
converts Z-up to Y-up, and maps each OmniPBR material's Albedo / ORM / Normal textures onto glTF
metallic-roughness PBR (ORM already uses glTF's channel layout: R occlusion, G roughness, B metallic).

usage: python usd2glb.py <asset.usd> <out.glb>
"""
import os
import struct
import sys

import numpy as np
import pygltflib as g
from pxr import Gf, Usd, UsdGeom, UsdShade

src, out = sys.argv[1], sys.argv[2]
stage = Usd.Stage.Open(src)
up = UsdGeom.GetStageUpAxis(stage)
mpu = UsdGeom.GetStageMetersPerUnit(stage)
# Z-up → Y-up: rotate -90° about X
to_y = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]], float) if up == "Z" else np.eye(3)


def textures_of(material):
    """Return {'albedo','orm','normal': absolute path} from a SimReady material network."""
    found = {}
    for prim in Usd.PrimRange(material.GetPrim()):
        if not prim.IsA(UsdShade.Shader):
            continue
        sh = UsdShade.Shader(prim)
        name = prim.GetName().lower()
        f = sh.GetInput("file")
        if f and f.Get():
            key = "albedo" if "albedo" in name or "diffuse" in name else "orm" if "orm" in name else "normal" if "normal" in name else None
            if key:
                found[key] = f.Get().resolvedPath or os.path.join(os.path.dirname(prim.GetStage().GetRootLayer().realPath), f.Get().path)
        for inp, key in (("diffuse_texture", "albedo"), ("ORM_texture", "orm"), ("normalmap_texture", "normal")):
            i = sh.GetInput(inp)
            if i and i.Get() and key not in found:
                found[key] = i.Get().resolvedPath
        dc = sh.GetInput("diffuse_color_constant") or sh.GetInput("diffuseColor")
        if dc and dc.Get() is not None and "color" not in found:
            v = dc.Get()
            try:
                found["color"] = [float(v[0]), float(v[1]), float(v[2])]
            except TypeError:
                pass
    return found


groups = {}  # material path -> lists of (positions, normals, uvs)
materials = {}
time = Usd.TimeCode.Default()
for prim in Usd.PrimRange.Stage(stage, Usd.TraverseInstanceProxies(Usd.PrimAllPrimsPredicate)):
    if not prim.IsA(UsdGeom.Mesh):
        continue
    mesh = UsdGeom.Mesh(prim)
    pts = np.array(mesh.GetPointsAttr().Get(time), float)
    counts = np.array(mesh.GetFaceVertexCountsAttr().Get(time), int)
    idx = np.array(mesh.GetFaceVertexIndicesAttr().Get(time), int)
    xf = np.array(UsdGeom.Xformable(prim).ComputeLocalToWorldTransform(time), float)  # row-major, row vectors
    world = (np.c_[pts, np.ones(len(pts))] @ xf)[:, :3] * mpu
    world = world @ to_y.T
    rot = xf[:3, :3]

    st_pv = UsdGeom.PrimvarsAPI(prim).GetPrimvar("st")
    st, st_interp, st_idx = None, None, None
    if st_pv and st_pv.HasValue():
        st = np.array(st_pv.Get(time), float)
        st_interp = st_pv.GetInterpolation()
        st_idx = np.array(st_pv.GetIndices(time), int) if st_pv.IsIndexed() else None

    nrm_attr = mesh.GetNormalsAttr()
    nrm = np.array(nrm_attr.Get(time), float) if nrm_attr.HasValue() else None
    nrm_interp = mesh.GetNormalsInterpolation()

    # corner -> face lookup
    face_of_corner = np.repeat(np.arange(len(counts)), counts)
    starts = np.r_[0, np.cumsum(counts)[:-1]]

    # Face -> material via GeomSubsets, falling back to the mesh binding
    face_mat = [None] * len(counts)
    base, _ = UsdShade.MaterialBindingAPI(prim).ComputeBoundMaterial()
    for i in range(len(counts)):
        face_mat[i] = base
    for sub in UsdGeom.Subset.GetAllGeomSubsets(mesh):
        m, _ = UsdShade.MaterialBindingAPI(sub.GetPrim()).ComputeBoundMaterial()
        if m:
            for f in sub.GetIndicesAttr().Get(time):
                face_mat[f] = m

    # Smooth fallback normals per point
    if nrm is None:
        acc = np.zeros_like(world)
        for f, c in enumerate(counts):
            ids = idx[starts[f]:starts[f] + c]
            n = np.cross(world[ids[1]] - world[ids[0]], world[ids[2]] - world[ids[0]])
            acc[ids] += n
        nrm = acc / np.maximum(np.linalg.norm(acc, axis=1, keepdims=True), 1e-9)
        nrm_interp, nrm_world = "vertex", True
    else:
        nrm_world = False

    def corner_normal(corner, point):
        if nrm_interp == "faceVarying":
            v = nrm[corner]
        elif nrm_interp == "uniform":
            v = nrm[face_of_corner[corner]]
        else:
            v = nrm[point]
        if not nrm_world:
            v = (v @ rot) @ to_y.T
        n = np.linalg.norm(v)
        return v / n if n else v

    def corner_uv(corner, point):
        if st is None:
            return (0.0, 0.0)
        k = corner if st_interp == "faceVarying" else point if st_interp in ("vertex", "varying") else face_of_corner[corner]
        if st_idx is not None:
            k = st_idx[k]
        u, v = st[k]
        return (u, 1.0 - v)  # USD origin is bottom-left; glTF is top-left

    for f, c in enumerate(counts):
        mat = face_mat[f]
        key = str(mat.GetPath()) if mat else "_default"
        if key not in groups:
            groups[key] = ([], [], [])
            materials[key] = textures_of(mat) if mat else {}
        P, N, T = groups[key]
        s = starts[f]
        for k in range(1, c - 1):  # fan triangulation
            for corner in (s, s + k, s + k + 1):
                pt = idx[corner]
                P.append(world[pt])
                N.append(corner_normal(corner, pt))
                T.append(corner_uv(corner, pt))

# ---- write GLB ----
gltf = g.GLTF2(asset=g.Asset(generator="usd2glb (portfolio)"))
gltf.scenes = [g.Scene(nodes=[0])]
gltf.nodes = [g.Node(mesh=0, name=os.path.splitext(os.path.basename(src))[0])]
blob = bytearray()
image_index = {}


def add_view(data: bytes, target=None):
    while len(blob) % 4:
        blob.append(0)
    off = len(blob)
    blob.extend(data)
    gltf.bufferViews.append(g.BufferView(buffer=0, byteOffset=off, byteLength=len(data), target=target))
    return len(gltf.bufferViews) - 1


def texture(path):
    if not path or not os.path.exists(path):
        return None
    if path not in image_index:
        view = add_view(open(path, "rb").read())
        gltf.images.append(g.Image(bufferView=view, mimeType="image/png"))
        if not gltf.samplers:
            gltf.samplers.append(g.Sampler(wrapS=g.REPEAT, wrapT=g.REPEAT, minFilter=g.LINEAR_MIPMAP_LINEAR, magFilter=g.LINEAR))
        gltf.textures.append(g.Texture(source=len(gltf.images) - 1, sampler=0))
        image_index[path] = len(gltf.textures) - 1
    return image_index[path]


prims = []
for key, (P, N, T) in groups.items():
    if not P:
        continue
    P = np.array(P, np.float32)
    N = np.array(N, np.float32)
    T = np.array(T, np.float32)
    acc = []
    for arr, typ in ((P, g.VEC3), (N, g.VEC3), (T, g.VEC2)):
        v = add_view(arr.tobytes(), g.ARRAY_BUFFER)
        a = g.Accessor(bufferView=v, componentType=g.FLOAT, count=len(arr), type=typ)
        if arr is P:
            a.min, a.max = P.min(0).tolist(), P.max(0).tolist()
        gltf.accessors.append(a)
        acc.append(len(gltf.accessors) - 1)
    tex = materials.get(key, {})
    # SimReady names encode the surface: <opacity>__<type>__<finish>_..., e.g. opaque__metal__glossy_a.
    # Only metal is metallic; the finish word sets roughness; glass is see-through.
    mname = key.split("/")[-1].lower()
    is_metal = "__metal__" in mname or "chrome" in mname
    finish = 0.3 if "glossy" in mname or "chrome" in mname else 0.85 if "rough" in mname else 0.6
    glass = mname.startswith("trans__") or "__glass__" in mname
    alpha = 0.35 if glass else 1
    pbr = g.PbrMetallicRoughness(
        baseColorFactor=[*(tex.get("color") or [1, 1, 1]), alpha],
        metallicFactor=1.0 if is_metal else 0.0,
        roughnessFactor=1.0 if tex.get("orm") else finish,
    )
    t = texture(tex.get("albedo"))
    if t is not None:
        pbr.baseColorTexture = g.TextureInfo(index=t)
    t = texture(tex.get("orm"))
    mat = g.Material(name=key.split("/")[-1], pbrMetallicRoughness=pbr, alphaMode="BLEND" if glass else "OPAQUE")
    if t is not None:
        pbr.metallicRoughnessTexture = g.TextureInfo(index=t)
        mat.occlusionTexture = g.OcclusionTextureInfo(index=t)
    t = texture(tex.get("normal"))
    if t is not None:
        mat.normalTexture = g.NormalMaterialTexture(index=t)
    gltf.materials.append(mat)
    prims.append(g.Primitive(attributes=g.Attributes(POSITION=acc[0], NORMAL=acc[1], TEXCOORD_0=acc[2]), material=len(gltf.materials) - 1))

gltf.meshes = [g.Mesh(primitives=prims)]
gltf.buffers = [g.Buffer(byteLength=len(blob))]
gltf.set_binary_blob(bytes(blob))
gltf.save_binary(out)
tris = sum(len(p[0]) for p in groups.values()) // 3
print(f"{out}: {len(prims)} materials, {tris} triangles, {len(image_index)} textures, {os.path.getsize(out) // 1024} KB")
