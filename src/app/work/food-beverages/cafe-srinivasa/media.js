// Shared by the page and its showreel: the media lists mix stills and reels,
// and the extension is the only thing that tells them apart.
export const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);
