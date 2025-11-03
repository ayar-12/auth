const forceHttps = (u) =>
  typeof u === "string" && u.startsWith("http://") ? u.replace(/^http:\/\//, "https://") : u;

const pickUrl = (o) => (o?.url || o?.secure_url || o?.src || null);

export function getRoutineImg(item) {
  if (!item) return "";
  // direct on routine item
  const direct =
    (typeof item.image === "string" && item.image) ||
    pickUrl(item.image) ||
    item.imagePreview;
  if (direct) return forceHttps(direct);

  // fallback to referenced product cover (requires populate)
  const p = item.product && typeof item.product === "object" ? item.product : null;
  if (p) {
    const mg = Array.isArray(p.mediaGroups?.product) ? p.mediaGroups.product : [];
    const legacy = Array.isArray(p.images) ? p.images : [];
    const mgUrl = pickUrl(mg[0]);
    const legacyUrl = pickUrl(legacy[0]) || (typeof legacy[0] === "string" ? legacy[0] : null);
    const out = mgUrl || legacyUrl;
    if (out) return forceHttps(out);
  }
  return "";
}
