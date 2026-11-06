export const MIN_IMAGE_SIDE = 400;
export const MAX_IMAGE_ASPECT = 2;

/** Mirrors the backend rules so users hear about a bad photo before submitting. */
export function imageProblem(width: number, height: number): string | null {
  if (Math.min(width, height) < MIN_IMAGE_SIDE) {
    return `Photo is too small (${width}x${height}px). Use one at least ${MIN_IMAGE_SIDE}px on each side.`;
  }
  if (Math.max(width / height, height / width) > MAX_IMAGE_ASPECT) {
    return 'Photo is too tall or wide and looks like a screenshot. Upload a normal photo of the item.';
  }
  return null;
}

const readSize = (file: File) =>
  createImageBitmap(file)
    .then((bitmap) => {
      const size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    })
    .catch(() => null);

export async function filterUsableImages(files: File[]) {
  const checked = await Promise.all(
    files.map(async (file) => {
      const size = await readSize(file);
      return { file, problem: size ? imageProblem(size.width, size.height) : 'Not a readable image.' };
    }),
  );
  return {
    valid: checked.filter((c) => !c.problem).map((c) => c.file),
    problems: checked.filter((c) => c.problem).map((c) => `${c.file.name}: ${c.problem}`),
  };
}
