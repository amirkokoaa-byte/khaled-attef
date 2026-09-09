export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('ImgBB API key is missing. Please add VITE_IMGBB_API_KEY to your Vercel Environment Variables.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url; // Direct image URL
  } else {
    throw new Error(data.error?.message || 'Failed to upload image to ImgBB');
  }
};

export const uploadVideoToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary config missing. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error(data.error?.message || 'Failed to upload video to Cloudinary');
  }
};

export const handleMediaUpload = async (file: File, type: 'image' | 'video'): Promise<string> => {
  if (type === 'image') {
    return await uploadImageToImgBB(file);
  } else {
    return await uploadVideoToCloudinary(file);
  }
};
