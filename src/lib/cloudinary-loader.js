/**
 * Cloudinary Image Loader para Next.js
 * Optimiza automáticamente las imágenes de Cloudinary con transformaciones
 */

export default function cloudinaryLoader({ src, width, quality }) {
  // Si no es una URL de Cloudinary, retornar la URL original
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  // Si ya tiene transformaciones aplicadas, retornar la URL original
  if (src.includes('/w_') || src.includes('/q_')) {
    return src;
  }

  try {
    // Extraer partes de la URL de Cloudinary
    const urlParts = src.split('/upload/');
    if (urlParts.length !== 2) {
      return src;
    }

    const [baseUrl, resourcePath] = urlParts;
    
    // Construir transformaciones optimizadas
    const transformations = [
      `w_${width}`,
      `q_${quality || 'auto'}`,
      'f_auto', // Formato automático (WebP, AVIF)
      'c_fill', // Crop para mantener aspect ratio
      'g_auto' // Gravity automático (mejor para faces)
    ].join(',');

    // Construir URL final optimizada
    return `${baseUrl}/upload/${transformations}/${resourcePath}`;
  } catch (error) {
    console.error('Error en cloudinaryLoader:', error);
    return src;
  }
}