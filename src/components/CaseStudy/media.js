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

// Splits a media list into `rows` near-equal, contiguous chunks, each
// carrying its starting index into the original list — a multi-row marquee
// needs that offset so a tile's lightbox index still points at the right
// item once the single strip is broken into several.
export const splitRows = (items, rows) => {
  const size = Math.ceil(items.length / rows);
  const chunks = [];
  for (let i = 0; i < rows; i++) {
    const offset = i * size;
    const chunk = items.slice(offset, offset + size);
    if (chunk.length) chunks.push({ items: chunk, offset });
  }
  return chunks;
};
