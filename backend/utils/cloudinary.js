const cloudinary = require('cloudinary').v2;

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Зураг upload хийх
const uploadImage = async (fileBuffer, folder = 'loan-app') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            { width: 1000, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Зураг upload хийхэд алдаа гарлаа');
  }
};

// Зураг устгах
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Зураг устгахад алдаа гарлаа:', error);
    return { success: false };
  }
};

module.exports = { uploadImage, deleteImage };