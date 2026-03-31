/**
 * Compresses an arbitrary image file (e.g. heavy JPEGs/HEICs from smartphones)
 * entirely inside the browser's Canvas API.
 * Preserves exact aspect ratio but limits max dimensions, outputting an ultra-light WebP chunk.
 *
 * @param {File} file - The original image file to compress.
 * @param {number} [maxDimension=1200] - The maximum width or height of the output image.
 * @returns {Promise<Blob>} A Promise that resolves to the compressed WebP image Blob.
 */
export async function compressImageWebP(
  file: File,
  maxDimension: number = 1200,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2D canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image into WebP format"));
          }
        },
        "image/webp",
        0.8,
      );
    };

    img.onerror = () =>
      reject(new Error("Failed to load image file into browser"));
    img.src = objectUrl;
  });
}
