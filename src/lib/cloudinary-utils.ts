export type AvatarSize = 'thumbnail' | 'small' | 'medium' | 'large';

export interface CloudinaryTransform {
  width: number;
  height: number;
  crop: string;
  gravity?: string;
  quality: string;
  format: string;
}

const AVATAR_SIZES: Record<AvatarSize, CloudinaryTransform> = {
  thumbnail: {
    width: 40,
    height: 40,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto'
  },
  small: {
    width: 80,
    height: 80,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto'
  },
  medium: {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto'
  },
  large: {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto'
  }
};

// URL de imagen por defecto - null para usar solo fallback de texto
export const DEFAULT_AVATAR_URL = null;

/**
 * Obtiene la URL del avatar optimizada para Cloudinary
 * @param photo - URL de la foto del usuario o null/undefined
 * @param size - Tamaño deseado del avatar
 * @returns URL optimizada de Cloudinary o imagen por defecto
 */
export function getAvatarUrl(photo: string | null | undefined, size: AvatarSize = 'small'): string | null {
  // Si no hay foto, retornar null para mostrar fallback de texto
  if (!photo) {
    return DEFAULT_AVATAR_URL;
  }

  // Si ya es una URL de Cloudinary, optimizarla
  if (photo.includes('res.cloudinary.com')) {
    return getOptimizedUrl(photo, size);
  }

  // Si es otra URL, intentar optimizarla (aunque podría no funcionar)
  return photo;
}

/**
 * Aplica transformaciones de Cloudinary a una URL existente
 * @param url - URL base de la imagen
 * @param size - Tamaño deseado
 * @returns URL con transformaciones aplicadas
 */
export function getOptimizedUrl(url: string, size: AvatarSize): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const transform = AVATAR_SIZES[size];
  
  // Extraer partes de la URL de Cloudinary
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) {
    return url;
  }

  const [baseUrl, resourcePath] = urlParts;
  
  // Construir transformaciones
  const transformations = [
    `w_${transform.width}`,
    `h_${transform.height}`,
    `c_${transform.crop}`,
    `g_${transform.gravity}`,
    `q_${transform.quality}`,
    `f_${transform.format}`
  ].join(',');

  // Construir URL final
  return `${baseUrl}/upload/${transformations}/${resourcePath}`;
}

/**
 * Verifica si una URL es de Cloudinary
 * @param url - URL a verificar
 * @returns true si es URL de Cloudinary
 */
export function isCloudinaryUrl(url: string | null | undefined): boolean {
  return !!(url && url.includes('res.cloudinary.com'));
}

/**
 * Extrae el public_id de una URL de Cloudinary
 * @param url - URL de Cloudinary
 * @returns public_id o null si no se puede extraer
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!isCloudinaryUrl(url)) {
    return null;
  }

  const matches = url.match(/\/v\d+\/(.+)\./);
  return matches ? matches[1] : null;
}

/**
 * Genera una URL con múltiples tamaños para srcSet
 * @param photo - URL de la foto
 * @returns objeto con URLs para diferentes densidades de píxeles
 */
export function getResponsiveAvatarUrls(photo: string | null | undefined, baseSize: AvatarSize = 'small') {
  const baseUrl = getAvatarUrl(photo, baseSize);
  
  if (!baseUrl || !isCloudinaryUrl(baseUrl) || !photo) {
    return {
      '1x': baseUrl,
      '2x': baseUrl
    };
  }

  const transform = AVATAR_SIZES[baseSize];
  const optimizedUrl = getOptimizedUrl(photo, baseSize);
  
  if (!optimizedUrl || !optimizedUrl.includes(`w_${transform.width}`)) {
    return {
      '1x': baseUrl,
      '2x': baseUrl
    };
  }
  
  return {
    '1x': baseUrl,
    '2x': optimizedUrl.replace(
      `w_${transform.width},h_${transform.height}`,
      `w_${transform.width * 2},h_${transform.height * 2}`
    )
  };
}