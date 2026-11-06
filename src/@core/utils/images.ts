import type { ImageLoaderProps } from 'next/image';

export const DEFAULT_IMAGE = '/assets/images/default_image.webp';

const UPLOAD_MARKER = '/image/upload/';

export const isCloudinaryUrl = (src: string) =>
  src.includes('res.cloudinary.com') && src.includes(UPLOAD_MARKER);

/** Lets Cloudinary resize at the edge instead of the Next server fetching full originals. */
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  return src.replace(UPLOAD_MARKER, `${UPLOAD_MARKER}f_auto,q_${quality ?? 'auto'},c_limit,w_${width}/`);
}
