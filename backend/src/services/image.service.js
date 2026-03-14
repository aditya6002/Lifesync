const { ApiError } = require("../middleware/errors.middleware");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadImage = async (image) => {
//   try {
//     if (!image) {
//       throw new ApiError(
//         "No image provided",
//         400,
//         "NO_IMAGE_PROVIDED",
//         "IMAGE_UPLOAD_FAILED",
//       );
//     }

//     const result = await cloudinary.uploader.upload(image.path, {
//       folder: "lumina",
//       use_filename: true,
//       unique_filename: false,
//     });

//     return result;
//   } catch (error) {
//     throw new ApiError("Failed to upload image", 500, "IMAGE_UPLOAD_FAILED", {
//       error: error.message,
//     });
//   }
// };

const uploadImage = async (image) => {
  try {
    if (!image || !image.buffer) {
      throw new ApiError(
        "No image provided",
        400,
        "NO_IMAGE_PROVIDED",
        "IMAGE_UPLOAD_FAILED",
      );
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "lumina",
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(image.buffer);
    });

    return result;
  } catch (error) {
    throw new ApiError("Failed to upload image", 500, "IMAGE_UPLOAD_FAILED", {
      error: error.message,
    });
  }
};
const getImage = (publicId) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
  });
};

const getSmallImage = (publicId) => {
  return cloudinary.url(publicId, {
    crop: "fill",
    gravity: "auto",
    width: 500,
    height: 500,
  });
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ApiError("Failed to delete image", 500, "IMAGE_DELETE_FAILED", {
      error: error.message,
    });
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  getImage,
  getSmallImage,
  deleteImage,
};
