const CLOUDINARY_IMAGE_MARKER = "/image/upload/";
const CLOUDINARY_VIDEO_MARKER = "/video/upload/";
const NEXT_IMAGE_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

const nextImageWidth = (width) =>
  NEXT_IMAGE_WIDTHS.find((candidate) => candidate >= width) ?? 3840;

const addCloudinaryTransform = (src, marker, transform) => {
  if (typeof src !== "string" || !src.includes(marker)) return src;

  const [base, query = ""] = src.split("?");
  const optimized = base.replace(marker, `${marker}${transform}/`);
  return query ? `${optimized}?${query}` : optimized;
};

export const optimizeImageUrl = (src, width = 1600) => {
  if (typeof src !== "string") return src;

  if (src.startsWith("/") && !src.startsWith("/_next/") && !src.endsWith(".svg")) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${nextImageWidth(width)}&q=75`;
  }

  return addCloudinaryTransform(
    src,
    CLOUDINARY_IMAGE_MARKER,
    `f_auto,q_auto:good,c_limit,w_${width}`
  );
};

export const optimizeVideoUrl = (src, width = 1280) =>
  addCloudinaryTransform(
    src,
    CLOUDINARY_VIDEO_MARKER,
    `f_auto,q_auto:eco,vc_auto,c_limit,w_${width}`
  );
