/**
 * Creates an HTMLImageElement from a URL.
 *
 * @param {string} url - The source URL of the image.
 * @returns {Promise<HTMLImageElement>} A Promise resolving to the loaded image element.
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid CORS issues on some images
    image.src = url;
  });

/**
 * Converts a degree value to radians.
 *
 * @param {number} degreeValue - The angle in degrees.
 * @returns {number} The equivalent angle in radians.
 */
export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Crops a given image using pixel boundaries and optionally rotates or flips it.
 * The output image is scaled to 400x400 and returned as a WebP Blob object.
 *
 * @param {string} imageSrc - The source URL of the image to crop.
 * @param {Object} pixelCrop - The dimensions and position to crop {x, y, width, height}.
 * @param {number} [rotation=0] - The rotation angle in degrees.
 * @param {Object} [flip={ horizontal: false, vertical: false }] - Flips the image horizontally or vertically.
 * @returns {Promise<Blob | null>} A Promise resolving to the cropped out image Blob in WebP format, or null if context errors.
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5,
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y),
  );

  const TARGET_SIZE = 400;
  const optimizedCanvas = document.createElement("canvas");
  optimizedCanvas.width = TARGET_SIZE;
  optimizedCanvas.height = TARGET_SIZE;
  const optimizedCtx = optimizedCanvas.getContext("2d");

  if (optimizedCtx) {
    optimizedCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      TARGET_SIZE,
      TARGET_SIZE,
    );
  }

  return new Promise((resolve) => {
    const finalCanvas = optimizedCtx ? optimizedCanvas : canvas;
    finalCanvas.toBlob(
      (file) => {
        resolve(file);
      },
      "image/webp",
      0.8,
    );
  });
}
