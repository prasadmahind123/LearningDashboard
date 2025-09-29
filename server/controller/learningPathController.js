import LearningPath from '../models/learningPath.js';
import Teacher from '../models/teacher.js';
import mongoose from 'mongoose';
import { uploadImage, uploadFile } from '../config/cloudinary.js';



// Helper function to upload content files
const uploadContentFiles = async (content, existingContentMap) => {
  const uploadedContent = [];

  for (const item of content) {
    let uploadedItem = {};

    if (item._id && existingContentMap[item._id]) {
      // Start with existing module to preserve _id and resources
      uploadedItem = { ...existingContentMap[item._id] };
    } else {
      // New module → assign new _id
      uploadedItem = { ...item, _id: new mongoose.Types.ObjectId(), resources: [] };
    }

    // Update title, description, duration if provided
    uploadedItem.title = item.title || uploadedItem.title;
    uploadedItem.description = item.description || uploadedItem.description;
    uploadedItem.duration = parseFloat(item.duration?.replace(/[^0-9.]/g, '')) || uploadedItem.duration || 0;

    // Upload files if they exist
    if (item.files) {
      uploadedItem.resources = uploadedItem.resources || [];

      // Video
      if (item.files.video) {
        try {
          const videoUpload = await uploadFile(item.files.video, 'video');
          uploadedItem.resources.push({
            type: 'video',
            url: videoUpload.url,
            publicId: videoUpload.publicId,
            duration: videoUpload.duration || null,
            format: videoUpload.format || 'mp4'
          });
        } catch (error) {
          console.error('Video upload failed:', error);
        }
      }

      // PDF
      if (item.files.pdf) {
        try {
          const pdfUpload = await uploadFile(item.files.pdf, 'raw');
          uploadedItem.resources.push({
            type: 'pdf',
            url: pdfUpload.url,
            publicId: pdfUpload.publicId,
            format: 'pdf',
            size: pdfUpload.bytes
          });
        } catch (error) {
          console.error('PDF upload failed:', error);
        }
      }

      // BibTeX
      if (item.files.bibtex) {
        try {
          const bibtexUpload = await uploadFile(item.files.bibtex, 'raw');
          uploadedItem.resources.push({
            type: 'bibtex',
            url: bibtexUpload.url,
            publicId: bibtexUpload.publicId,
            format: 'bib'
          });
        } catch (error) {
          console.error('BibTeX upload failed:', error);
        }
      }

      // Excel
      if (item.files.excel) {
        try {
          const excelUpload = await uploadFile(item.files.excel, 'raw');
          uploadedItem.resources.push({
            type: 'excel',
            url: excelUpload.url,
            publicId: excelUpload.publicId,
            format: 'xlsx'
          });
        } catch (error) {
          console.error('Excel upload failed:', error);
        }
      }

      // Additional files
      if (item.files.additionalFiles && Array.isArray(item.files.additionalFiles)) {
        for (const additionalFile of item.files.additionalFiles) {
          try {
            const additionalUpload = await uploadFile(additionalFile, 'auto');
            uploadedItem.resources.push({
              type: 'additional',
              url: additionalUpload.url,
              publicId: additionalUpload.publicId,
              format: additionalUpload.format || 'file'
            });
          } catch (error) {
            console.error('Additional file upload failed:', error);
          }
        }
      }
    }

    uploadedContent.push(uploadedItem);
  }

  return uploadedContent;
};


// Create a new learning path
export const createLearningPath = async (req, res) => {
  try {
    let { title, description, category, level, price, duration , code , isPrivate } = req.body;
    
    // Handle both JSON and form-data formats
    let content = [];
    let image = null;
    
    // Check if files were uploaded
    if (req.files) {
      // Handle pathImage
      if (req.files['pathImage'] && req.files['pathImage'][0]) {
        const imageUpload = await uploadImage(req.files['pathImage'][0].path); // use .path instead of .buffer
        image = imageUpload.secure_url;
      }

      
      // Parse content from form data
      if (req.body.content) {
        try {
          content = JSON.parse(req.body.content);
        } catch (e) {
          content = [];
        }
      }
      
      // Handle uploaded content files
      const processedContent = [];
      
      // Process each content item
      for (let i = 0; i < content.length; i++) {
        const contentItem = content[i];
        const uploadedItem = {
          title: contentItem.title || '',
          description: contentItem.description || '',
          duration: parseFloat(contentItem.duration || 0),
          resources: []
        };
        
        // Handle video files
        const videoKey = `content[${i}][files][video]`;
        if (req.files[videoKey] && req.files[videoKey][0]) {
          const videoUpload = await uploadFile(req.files[videoKey][0].path, 'video');
          uploadedItem.resources.push({
            fileUrl: videoUpload.url,
            fileType: 'video',
            fileName: req.files[videoKey][0].originalname,
            publicId: videoUpload.publicId,
            duration: videoUpload.duration || null,
            format: videoUpload.format || 'mp4',
            size: videoUpload.bytes || null
          });
        }
        
        // Handle PDF files
        const pdfKey = `content[${i}][files][pdf]`;
        if (req.files[pdfKey] && req.files[pdfKey][0]) {
         const pdfUpload = await uploadFile(req.files[pdfKey][0].path, 'raw');
          uploadedItem.resources.push({
            fileUrl: pdfUpload.url,
            fileType: 'pdf',
            fileName: req.files[pdfKey][0].originalname,
            publicId: pdfUpload.publicId,
            format: 'pdf',
            size: pdfUpload.bytes || null
          });

        }
        
        // Handle other file types similarly...
        processedContent.push(uploadedItem);
      }
      
      content = processedContent;
    } else {
      // Handle JSON format
      content = req.body.content || [];
      image = req.body.image;
      
      if (image) {
        const uploadedImage = await uploadImage(image);
        image = uploadedImage.url;
      }
    }

    // Validate required fields
    if (!title || !description || !category || !level || !price || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Calculate total hours from content
    const totalHours = Array.isArray(content) ? content.reduce((total, item) => {
      return total + (parseFloat(item.duration) || 0);
    }, 0) : 0;

    // Create new learning path
    const learningPath = new LearningPath({
      title,
      description,
      category,
      level,
      price,
      duration,
      image: image || '',
      code : code || '',
      isPrivate : isPrivate || false,
      createdBy: req.userId,
      content: content || [],
      totalHours,
      revenue: 0
    });

    await learningPath.save();




    // Add learning path to teacher's createdPaths
    await Teacher.findByIdAndUpdate(
      req.userId,
      { $push: { createdPaths: learningPath._id } },
      { new : true }
    );

    res.status(201).json({
      success: true,
      message: 'Learning path created successfully',
      learningPath
    });
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating learning path',
      error: error.message
    });
  }
};

// Get all learning paths for a teacher
export const getTeacherLearningPaths = async (req, res) => {
  try {
    const teacherId = req.userId;
    const learningPaths = await LearningPath.find({ createdBy: req.userId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      learningPaths,
      teacherId
    });
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching learning paths',
      error: error.message
    });
  }
};

// ✅ Get learning path by ID
export const learningPathById = async (req, res) => {
  try {
    const { id } = req.params;  // use params instead of body
    const learningPath = await LearningPath.findById(id).populate("createdBy", "fullName email createdPaths expertise");

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      });
    }

    res.status(200).json({
      success: true,
      learningPath
    });
  } catch (error) {
    console.error('Error retrieving learning path:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving learning path',
      error: error.message
    });
  }
};


//get all learning paths

export const getAllLearningPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find()
      .populate("createdBy", "fullName email createdPaths expertise") // optional, show teacher info
      .lean();

    res.status(200).json({
      success: true,
      paths
    });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning paths",
    });
  }
};


// Delete a learning path
export const deleteLearningPath = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the learning path
    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      });
    }

    // Check if the teacher owns this learning path
    if (learningPath.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this learning path'
      });
    }

    // Remove learning path from teacher's createdPaths
    await Teacher.findByIdAndUpdate(
      req.userId,
      { $pull: { createdPaths: id } }
    );

    // Delete the learning path
    await LearningPath.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Learning path deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting learning path',
      error: error.message
    });
  }
};

export const updateLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      description,
      category,
      level,
      price,
      duration,
      content // can be array or JSON string
    } = req.body;

    // ✅ Ensure content is parsed into an array
    if (content) {
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
          if (typeof content === "string") {
            content = JSON.parse(content); // handle double JSON encoding
          }
        } catch (err) {
          return res.status(400).json({ success: false, message: "Invalid content format" });
        }
      }
      if (!Array.isArray(content)) {
        return res.status(400).json({ success: false, message: "Content must be an array" });
      }
    } else {
      content = [];
    }

    // ✅ Fetch path
    const learningPath = await LearningPath.findById(id);
    if (!learningPath) {
      return res.status(404).json({ success: false, message: "Learning path not found" });
    }

    // ✅ Authorization
    if (learningPath.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this learning path" });
    }

    // ✅ Map existing modules
    const existingContentMap = {};
    learningPath.content.forEach(mod => {
      if (mod._id) existingContentMap[mod._id.toString()] = mod;
    });

    // ✅ Merge content
    const updatedContentMap = { ...existingContentMap };
    if (content.length > 0) {
      for (const module of content) {
        if (typeof module !== "object" || module === null) {
          return res.status(400).json({ success: false, message: "Invalid module format" });
        }

        if (module._id && updatedContentMap[module._id]) {
          // Existing module → preserve required fields if missing
          const old = updatedContentMap[module._id];
          updatedContentMap[module._id] = {
            ...old,
            ...module,
            title: module.title ?? old.title,
            description: module.description ?? old.description,
            duration: module.duration ?? old.duration
          };
        } else {
          // ✅ New module → must include title
          if (!module.title || !module.title.trim()) {
            return res.status(400).json({
              success: false,
              message: "Each new module must include a title"
            });
          }
          module._id = new mongoose.Types.ObjectId();
          updatedContentMap[module._id.toString()] = module;
        }
      }
    }

    let updatedContent = Object.values(updatedContentMap);

    // ✅ File uploads
    if (req.files && Object.keys(req.files).length > 0) {
      updatedContent = await uploadContentFiles(updatedContent, existingContentMap);
    }

    // ✅ Total hours
    const totalHours = updatedContent.reduce((sum, item) => {
      const hrs = parseFloat(String(item.duration ?? "0").replace(/[^0-9.]/g, "")) || 0;
      return sum + hrs;
    }, 0);

    // ✅ Update path fields
    learningPath.title = title || learningPath.title;
    learningPath.description = description || learningPath.description;
    learningPath.category = category || learningPath.category;
    learningPath.level = level || learningPath.level;
    learningPath.price = price || learningPath.price;
    learningPath.duration = duration || learningPath.duration;
    learningPath.content = updatedContent;
    learningPath.totalHours = totalHours;

    // ✅ Optional free access code
    if (req.body.code && req.body.code.trim() !== "") {
      learningPath.code = req.body.code.trim();
    }

    await learningPath.save();

    res.status(200).json({
      success: true,
      message: "Learning path updated successfully",
      learningPath
    });
  } catch (error) {
    console.error("Error updating learning path:", error);
    res.status(500).json({
      success: false,
      message: "Error updating learning path",
      error: error.message
    });
  }
};


// Delete a single module from a learning path
export const deleteModule = async (req, res) => {
  try {
    const { pathId, index } = req.params;

    const learningPath = await LearningPath.findById(pathId);
    if (!learningPath) {
      return res.status(404).json({ success: false, message: "Learning path not found" });
    }

    // Check ownership
    if (learningPath.createdBy.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Remove by index
    if (index < 0 || index >= learningPath.content.length) {
      return res.status(400).json({ success: false, message: "Invalid module index" });
    }

    learningPath.content.splice(index, 1);

    // Recalculate total hours
    learningPath.totalHours = learningPath.content.reduce((total, item) => {
      const durationStr = item.duration || "0";
      const hours = parseFloat(durationStr.replace(/[^0-9.]/g, "")) || 0;
      return total + hours;
    }, 0);

    await learningPath.save();

    res.json({
      success: true,
      message: "Module deleted successfully",
      learningPath,
    });
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};





