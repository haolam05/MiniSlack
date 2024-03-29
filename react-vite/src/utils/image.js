export const getAvatarUrl = url => {
  if (url) return url;
  return "/images/default-avatar.png";
}

export const isImageValid = imageName => {
  if (!imageName.length) return false;
  const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
  const imageParts = imageName.split(".");
  return imageParts && imageParts[1] && allowedExtensions.includes(imageParts[1].toLowerCase());
}
