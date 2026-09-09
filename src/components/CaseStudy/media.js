// Helpers shared by every case-study part. The media lists mix stills and
// reels, and the file extension is the only thing that tells them apart.
export const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

export const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const pad = (n) => String(n).padStart(2, "0");
