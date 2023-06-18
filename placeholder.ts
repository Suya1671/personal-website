// Copied from: https://github.com/xiphux/svimg
import sharp from 'sharp';

const placeholderWidth = 16;

async function resizeImage(
    inputFile: string,
    options: {
        height?: number;
        quality?: number;
        width: number;
    }
) {
    if (!inputFile) {
        throw new Error('Input file is required');
    }

    let sharpInstance = sharp(inputFile).toFormat('webp').blur(3);

    sharpInstance = sharpInstance.resize(
        options.width,
        options.height
    );

    return sharpInstance.toBuffer();
}

export async function getImageMetadata(inputFile: string) {
    if (!inputFile) {
        throw new Error('Input file is required');
    }

    return sharp(inputFile).metadata();
}

// Sharp only supports a very specific list of image formats,
// no point depending on a complete mime type database

export function getMimeType(format: string) {
    switch (format) {
        case 'jpeg':
        case 'png':
        case 'webp':
        case 'avif':
        case 'tiff':
        case 'gif': {
            return `image/${format}`;
        }

        case 'svg': {
            return 'image/svg+xml';
        }

        default: {
            return '';
        }
    }
}

export async function createPlaceholder(inputFile: string) {
    if (!inputFile) {
        throw new Error('Input file is required');
    }

    const [{format}, blurData] = await Promise.all([
        getImageMetadata(inputFile),
        resizeImage(inputFile, {width: placeholderWidth})
    ]);
    const blur64 = blurData.toString('base64');
    const mime = getMimeType(format ?? '');
    const href = `data:${mime};base64,${blur64}`;
    return href;
}
