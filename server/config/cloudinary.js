import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import streamifier from 'streamifier';

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const uploadCertificate = async (filePath) => {
    try {
        if (!filePath) {
            throw new Error("No file path provided for upload");
        }
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw',
            folder: 'certificates',
        });
        console.log("File uploaded successfully:", result);
        
        // Clean up temporary file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return result.secure_url;
    } catch (error) {
        // Clean up temporary file on error
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
}

const uploadImage = async (file, options = {}) => {
  try {
    if (Buffer.isBuffer(file)) {
      // Handle Buffer upload
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'learning-paths/images',
            ...options,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file).pipe(stream);
      });
    } else if (typeof file === 'string') {
      // Handle file path
      const result = await cloudinary.uploader.upload(file, {
        resource_type: 'image',
        folder: 'learning-paths/images',
        ...options,
      });

      if (fs.existsSync(file)) {
        fs.unlinkSync(file); // cleanup
      }
      return result;
    } else {
      throw new Error('Unsupported file type for uploadImage');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const uploadVideo = async (filePath, options = {}) => {
    try {
        if (!filePath) {
            throw new Error("No file path provided for upload");
            }
            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: 'video',
                folder: 'learning-paths/videos',
                ...options
                });
                
    }catch(error){
        console.error("Error uploading to Cloudinary:", error);
    }
}

const uploadDocument = async (filePath, options = {}) => {
    try {
        if (!filePath) {
            throw new Error("No file path provided for upload");
        }
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw',
            folder: 'learning-paths/documents',
            ...options
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes
        };
    } catch (error) {
        fs.unlinkSync(filePath);
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
}

const uploadFile = async (filePath, type = 'auto', options = {}) => {
    try {
        if (!filePath) {
            throw new Error("No file path provided for upload");
        }

        let resourceType = type;
        if (type === 'auto') {
            const extension = filePath.split('.').pop().toLowerCase();
            const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'];
            const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'bib', 'bibtex'];
            
            if (videoExtensions.includes(extension)) {
                resourceType = 'video';
            } else if (documentExtensions.includes(extension)) {
                resourceType = 'raw';
            } else {
                resourceType = 'image';
            }
        }

        switch (resourceType) {
            case 'image':
                return uploadImage(filePath, options);
            case 'video':
                return uploadVideo(filePath, options);
            case 'raw':
                return uploadDocument(filePath, options);
            default:
                return uploadImage(filePath, options);
        }
    } catch (error) {
        fs.unlinkSync(filePath);
        throw error;
    }
}

const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        return true;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw new Error("Cloudinary deletion failed");
    }
}

export { connectCloudinary, uploadCertificate, uploadImage, uploadVideo, uploadDocument, uploadFile, deleteFile };
