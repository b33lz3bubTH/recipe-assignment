// Utility function to format image URLs
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's just a filename (UUID format), prepend the base URL
  if (imageUrl.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.(jpg|jpeg|png|gif|webp)$/i)) {
    return `https://recipe-assignment-production.up.railway.app/api/upload/file?file=${imageUrl}`;
  }
  
  // If it's a relative path starting with /api/upload/file, make it absolute
  if (imageUrl.startsWith('/api/upload/file')) {
    return `https://recipe-assignment-production.up.railway.app${imageUrl}`;
  }
  
  // Return as is for other cases
  return imageUrl;
}; 