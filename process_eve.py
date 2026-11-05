import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = "assets/eve-src.jpg"
OUT = "assets"
TARGET_BG = np.array([244.0, 244.0, 244.0])  # #F4F4F4
FACE_DARK = (8, 11, 15)
CYAN = (0, 205, 215)
INK = (46, 52, 58)

img = Image.open(SRC).convert("RGB")
W, H = img.size
a = np.asarray(img).astype(np.float32)
print("size", W, H)

# --- 1. White-balance paper to #F4F4F4 ---
c = 12
corners = np.concatenate([
    a[:c, :c].reshape(-1, 3), a[:c, -c:].reshape(-1, 3),
    a[-c:, :c].reshape(-1, 3), a[-c:, -c:].reshape(-1, 3),
])
bg = np.median(corners, axis=0)
print("bg sample", bg)
a = np.clip(a * (TARGET_BG / np.clip(bg, 1, 255)), 0, 255)

diff = np.abs(a - TARGET_BG).max(axis=2)
lum = a.mean(axis=2)
solid = diff > 14

# --- 2. Robot core: open the solid mask so thin sketch strokes die ---
core = np.asarray(
    Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))
) > 0
core = np.asarray(
    Image.fromarray((core * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(21))
) > 0
ys, xs = np.where(core)
ry, cxs = ys, xs
print("core bbox x", cxs.min(), cxs.max(), "y", ry.min(), ry.max())
ecx, ecy = (cxs.min() + cxs.max()) / 2, (ry.min() + ry.max()) / 2
erx = (cxs.max() - cxs.min()) / 2 + W * 0.05
ery = (ry.max() - ry.min()) / 2 + H * 0.04

img2 = Image.fromarray(a.astype(np.uint8))
draw = ImageDraw.Draw(img2)

# --- 3. Detect glowing eyes (cyan, bright) in the face band ---
r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]
eye_mask = (b_ > r_ + 20) & (b_ > 110)
eye_mask[: int(H * 0.15), :] = False
eye_mask[int(H * 0.38):, :] = False

def bbox(mask, xoff=0):
    yy, xx = np.where(mask)
    if len(xx) < 40:
        return None
    return [float(xx.min() + xoff), float(yy.min()),
            float(xx.max() + xoff), float(yy.max()), int(len(xx))]

colsum = eye_mask.sum(axis=0)
cols = np.where(colsum > 0)[0]
clusters, start, prev = [], cols[0], cols[0]
for x in cols[1:]:
    if x - prev > 10:
        clusters.append((start, prev))
        start = x
    prev = x
clusters.append((start, prev))
cands = [b for c in clusters if (b := bbox(eye_mask[:, c[0]:c[1] + 1], xoff=c[0]))]
cands.sort(key=lambda c: -c[4])
eyes = sorted(cands[:2], key=lambda c: c[0])
eyeL, eyeR = eyes[0][:4], eyes[1][:4]
print("eyeL", eyeL, "eyeR", eyeR)

eyes_out = {}
for name, bb in (("l", eyeL), ("r", eyeR)):
    x0, y0, x1, y1 = bb
    pad_x, pad_y = (x1 - x0) * 0.25, (y1 - y0) * 0.35
    draw.ellipse([x0 - pad_x, y0 - pad_y, x1 + pad_x, y1 + pad_y], fill=FACE_DARK)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    eyes_out[name] = {
        "cx": round(cx / W * 100, 3), "cy": round(cy / H * 100, 3),
        "w": round((x1 - x0) / W * 100, 3), "h": round((y1 - y0) / H * 100, 3),
    }

# --- 4. Custom detail: antenna with glowing tip above the dome ---
ax = int(ecx)
tip_y = int(ry.min()) - 46
draw.line([ax, tip_y + 18, ax, tip_y + 64], fill=INK, width=4)
draw.line([ax - 6, tip_y + 32, ax + 6, tip_y + 32], fill=INK, width=2)
draw.ellipse([ax - 9, tip_y, ax + 9, tip_y + 18], fill=CYAN, outline=INK, width=2)
draw.ellipse([ax - 3, tip_y + 5, ax + 3, tip_y + 11], fill=(240, 255, 255))
a = np.asarray(img2).astype(np.float32)

# --- 5. Erase the "N E V O" caption at the bottom ---
cap = a[920:985, 150:430]
tx = np.asarray(
    Image.fromarray(((cap.mean(axis=2) < 235) * 255).astype(np.uint8)).filter(
        ImageFilter.MaxFilter(5))
) > 0
cap[tx] = TARGET_BG
a[920:985, 150:430] = cap
img2 = Image.fromarray(a.astype(np.uint8))

# --- 6. Erase annotation clutter (side diagrams, labels, margin text) ---
diff = np.abs(a - TARGET_BG).max(axis=2)
solid = diff > 14
core = np.asarray(
    Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))
) > 0
core = np.asarray(
    Image.fromarray((core * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(21))
) > 0
core[tip_y - 6:tip_y + 70, ax - 6:ax + 7] = True          # keep antenna
halo = np.asarray(
    Image.fromarray((core * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(121)),
    dtype=np.float32) / 255.0
halo = np.asarray(
    Image.fromarray((halo * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10)),
    dtype=np.float32) / 255.0
protect = np.asarray(
    Image.fromarray((core * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(21))
) > 0

rects = np.zeros((H, W), bool)
for x0, y0, x1, y1 in [
    (30, 90, 200, 390),    # left top: head sketch + labels
    (10, 560, 190, 700),   # left mid labels
    (15, 720, 165, 850),   # bottom-left thruster diagram
    (450, 90, 576, 340),   # right top: mini robot sketch
    (440, 320, 576, 470),  # right: part diagrams + sensor text
    (480, 460, 576, 610),  # right: sensor circle
    (390, 640, 576, 940),  # right bottom: KEY FEATURES text
    (0, 0, 576, 85),       # top margin headers
    (10, 820, 420, 925),   # bottom-left: POWER SOURCE bars
]:
    rects[y0:y1, x0:x1] = True
hard = np.zeros((H, W), bool)
for x0, y0, x1, y1 in [
    (470, 450, 576, 580),  # right sensor circle
    (25, 700, 160, 820),   # bottom-left thruster pod
    (55, 120, 190, 240),   # top-left head sketch
]:
    hard[y0:y1, x0:x1] = True
erase = np.maximum(1 - halo, np.maximum(
    (rects & ~protect).astype(np.float32), hard.astype(np.float32)))
erase = np.asarray(
    Image.fromarray((erase * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(8)),
    dtype=np.float32) / 255.0
a = a * (1 - erase[..., None]) + TARGET_BG * erase[..., None]

# --- 7. Erase ALL sketch lines inside the halo outside the robot itself ---
diff = np.abs(a - TARGET_BG).max(axis=2)
w = halo * (1 - protect.astype(np.float32))
w = np.asarray(
    Image.fromarray((w * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4)),
    dtype=np.float32) / 255.0
a = a * (1 - w[..., None]) + TARGET_BG * w[..., None]

# --- 8. Elliptical feathered alpha around the robot ---
yy, xx = np.mgrid[0:H, 0:W]
e = ((xx - ecx) / erx) ** 2 + ((yy - ecy) / ery) ** 2
alpha = np.clip((1.0 - e) / 0.18, 0, 1)
alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(
    ImageFilter.GaussianBlur(24))).astype(np.float32) / 255.0

# whole robot, single layer
out = np.dstack([a, alpha * 255.0]).astype(np.uint8)
Image.fromarray(out, "RGBA").save(f"{OUT}/eve-full.png")
print("saved full")

# --- slices for the exploded view ---
def band(y, lo, hi, f):
    up = np.clip((y - (lo - f)) / (2 * f), 0, 1) if lo > -1e9 else 1.0
    dn = np.clip(((hi + f) - y) / (2 * f), 0, 1) if hi < 1e9 else 1.0
    return up * dn

cut1 = ry.min() + (ry.max() - ry.min()) * 0.50   # neck / torso seam
cut2 = ry.min() + (ry.max() - ry.min()) * 0.80   # body -> tail tip
f = H * 0.028
fg = np.clip((diff - 6.0) / 24.0, 0, 1)
fg = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).filter(
    ImageFilter.GaussianBlur(3))).astype(np.float32) / 255.0
for name, m in {
    "head":  band(yy, -1e9, cut1, f),
    "torso": band(yy, cut1, cut2, f),
    "tail":  band(yy, cut2, 1e9, f),
}.items():
    m_a = np.where(m >= 0.999, 1.0, m * fg)
    out = np.dstack([a, alpha * m_a * 255.0]).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(f"{OUT}/eve-{name}.png")
    print("saved", name)

meta = {"w": W, "h": H, "eyes": eyes_out}
with open(f"{OUT}/eve.json", "w") as fp:
    json.dump(meta, fp, indent=2)
print(json.dumps(meta))
