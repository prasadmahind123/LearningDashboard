// import LearningPath from '../models/learningPath.js';
// import Teacher from '../models/teacher.js';
// import Learner from '../models/learner.js'
// import mongoose from 'mongoose';
// import {
//   uploadImage,
//   uploadFile
// } from '../config/cloudinary.js';


// // Helper function to upload content files
// // const uploadContentFiles = async (content, existingContentMap) => {
// //   const uploadedContent = [];

// //   for (const item of content) {
// //     let uploadedItem = {};

// //     if (item._id && existingContentMap[item._id]) {
// //       // Start with existing module to preserve _id and resources
// //       uploadedItem = { ...existingContentMap[item._id]
// //       };
// //     } else {
// //       // New module → assign new _id
// //       uploadedItem = { ...item,
// //         _id: new mongoose.Types.ObjectId(),
// //         resources: []
// //       };
// //     }

// //     // Update title, description, duration if provided
// //     uploadedItem.title = item.title || uploadedItem.title;
// //     uploadedItem.description = item.description || uploadedItem.description;
// //     uploadedItem.duration = parseFloat(item.duration?.replace(/[^0-9.]/g, '')) || uploadedItem.duration || 0;

// //     // Upload files if they exist
// //     if (item.files) {
// //       uploadedItem.resources = uploadedItem.resources || [];

// //       // Video
// //       if (item.files.video) {
// //         try {
// //           const videoUpload = await uploadFile(item.files.video, 'video');
// //           uploadedItem.resources.push({
// //             type: 'video',
// //             url: videoUpload.url,
// //             publicId: videoUpload.publicId,
// //             duration: videoUpload.duration || null,
// //             format: videoUpload.format || 'mp4'
// //           });
// //         } catch (error) {
// //           console.error('Video upload failed:', error);
// //         }
// //       }

// //       // PDF
// //       if (item.files.pdf) {
// //         try {
// //           const pdfUpload = await uploadFile(item.files.pdf, 'raw');
// //           uploadedItem.resources.push({
// //             type: 'pdf',
// //             url: pdfUpload.url,
// //             publicId: pdfUpload.publicId,
// //             format: 'pdf',
// //             size: pdfUpload.bytes
// //           });
// //         } catch (error) {
// //           console.error('PDF upload failed:', error);
// //         }
// //       }

// //       // BibTeX
// //       if (item.files.bibtex) {
// //         try {
// //           const bibtexUpload = await uploadFile(item.files.bibtex, 'raw');
// //           uploadedItem.resources.push({
// //             type: 'bibtex',
// //             url: bibtexUpload.url,
// //             publicId: bibtexUpload.publicId,
// //             format: 'bib'
// //           });
// //         } catch (error) {
// //           console.error('BibTeX upload failed:', error);
// //         }
// //       }

// //       // Excel
// //       if (item.files.excel) {
// //         try {
// //           const excelUpload = await uploadFile(item.files.excel, 'raw');
// //           uploadedItem.resources.push({
// //             type: 'excel',
// //             url: excelUpload.url,
// //             publicId: excelUpload.publicId,
// //             format: 'xlsx'
// //           });
// //         } catch (error) {
// //           console.error('Excel upload failed:', error);
// //         }
// //       }

// //       // Additional files
// //       if (item.files.additionalFiles && Array.isArray(item.files.additionalFiles)) {
// //         for (const additionalFile of item.files.additionalFiles) {
// //           try {
// //             const additionalUpload = await uploadFile(additionalFile, 'auto');
// //             uploadedItem.resources.push({
// //               type: 'additional',
// //               url: additionalUpload.url,
// //               publicId: additionalUpload.publicId,
// //               format: additionalUpload.format || 'file'
// //             });
// //           } catch (error) {
// //             console.error('Additional file upload failed:', error);
// //           }
// //         }
// //       }
// //     }

// //     uploadedContent.push(uploadedItem);
// //   }

// //   return uploadedContent;
// // };


// // Create a new learning path
// export const createLearningPath = async (req, res) => {
//   try {
//     let {
//       title,
//       description,
//       category,
//       level,
//       price,
//       duration,
//       learners,
//       code,
//       isPrivate
//     } = req.body;

//     // Handle both JSON and form-data formats
//     let content = [];
//     let image = null;

//     // Check if files were uploaded
//     if (req.files) {
//       // Handle pathImage
//       const pathImage = req.files.find(file => file.fieldname === 'pathImage');
//       if (pathImage) {
//         const imageUpload = await uploadImage(pathImage.path);
//         image = imageUpload.secure_url;
//       }


//       // Parse content from form data
//       if (req.body.content) {
//         try {
//           content = JSON.parse(req.body.content);
//         } catch (e) {
//           content = [];
//         }
//       }

//       // Handle uploaded content files
//       const processedContent = [];

//       // Process each content item
//       for (let i = 0; i < content.length; i++) {
//         const contentItem = content[i];
//         const uploadedItem = {
//           title: contentItem.title || "",
//           description: contentItem.description || "",
//           duration: parseFloat(contentItem.duration || 0),
//           urls: Array.isArray(contentItem.urls)
//             ? contentItem.urls
//             : contentItem.urls
//             ? [contentItem.urls]
//             : [],
//           resources: []
//         };

//         // Handle multiple files
//         const allFiles = req.files.filter(f => f.fieldname.includes(`content[${i}][files]`));
//         for (const file of allFiles) {
//           try {
//             const uploadResult = await uploadFile(file.path, "auto");
//             uploadedItem.resources.push({
//               fileUrl: uploadResult.url,
//               fileType: file.mimetype.split("/")[0],
//               fileName: file.originalname,
//               publicId: uploadResult.publicId,
//               format: uploadResult.format,
//               size: uploadResult.bytes
//             });
//           } catch (error) {
//             console.error("File upload failed:", error);
//           }
//         }

//         processedContent.push(uploadedItem);
//       }


//       content = processedContent;
//     } else {
//       // Handle JSON format
//       content = req.body.content || [];
//       image = req.body.image;

//       if (image) {
//         const uploadedImage = await uploadImage(image);
//         image = uploadedImage.url;
//       }
//     }

//     // Validate required fields
//     if (!title || !description || !category || !level || !price || !duration) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields'
//       });
//     }

//     // Calculate total hours from content
//     const totalHours = Array.isArray(content) ? content.reduce((total, item) => {
//       return total + (parseFloat(item.duration) || 0);
//     }, 0) : 0;

//     // Create new learning path
//     const learningPath = new LearningPath({
//       title,
//       description,
//       category,
//       level,
//       price,
//       duration,
//       image: image || '',
//       code: code || '',
//       isPrivate: isPrivate || false,
//       createdBy: req.userId,
//       learners : learners || [],
//       content: content || [],
//       totalHours,
//       revenue: 0
//     });

//     await learningPath.save();




//     // Add learning path to teacher's createdPaths
//     await Teacher.findByIdAndUpdate(
//       req.userId, {
//         $push: {
//           createdPaths: learningPath._id
//         }
//       }, {
//         new: true
//       }
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Learning path created successfully',
//       learningPath
//     });
//   } catch (error) {
//     console.error('Error creating learning path:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating learning path',
//       error: error.message
//     });
//   }
// };

// // Get all learning paths for a teacher
// export const getTeacherLearningPaths = async (req, res) => {
//   try {
//     const teacherId = req.userId;
//     const learningPaths = await LearningPath.find({
//         createdBy: req.userId
//       })
//       .populate('createdBy', 'name email')
//       .sort({
//         createdAt: -1
//       });

//     res.status(200).json({
//       success: true,
//       learningPaths,
//       teacherId
//     });
//   } catch (error) {
//     console.error('Error fetching learning paths:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching learning paths',
//       error: error.message
//     });
//   }
// };

// // ✅ Get learning path by ID
// export const learningPathById = async (req, res) => {
//   try {
//     const {
//       id
//     } = req.params; // use params instead of body
//     const learningPath = await LearningPath.findById(id).populate("createdBy", "fullName email createdPaths expertise");

//     if (!learningPath) {
//       return res.status(404).json({
//         success: false,
//         message: 'Learning path not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       learningPath
//     });
//   } catch (error) {
//     console.error('Error retrieving learning path:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving learning path',
//       error: error.message
//     });
//   }
// };


// //get all learning paths

// export const getAllLearningPaths = async (req, res) => {
//   try {
//     const paths = await LearningPath.find()
//       .populate("createdBy", "fullName email createdPaths expertise") // optional, show teacher info
//       .lean();

//     res.status(200).json({
//       success: true,
//       paths
//     });
//   } catch (error) {
//     console.error("Error fetching learning paths:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch learning paths",
//     });
//   }
// };


// // Delete a learning path
// export const deleteLearningPath = async (req, res) => {
//   try {
//     const {
//       id
//     } = req.params;

//     // Find the learning path
//     const learningPath = await LearningPath.findById(id);
//     if (!learningPath) {
//       return res.status(404).json({
//         success: false,
//         message: 'Learning path not found'
//       });
//     }

//     // Check if the teacher owns this learning path
//     if (learningPath.createdBy.toString() !== req.userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to delete this learning path'
//       });
//     }

//     // Remove learning path from teacher's createdPaths
//     await Teacher.findByIdAndUpdate(
//       req.userId, {
//         $pull: {
//           createdPaths: id
//         }
//       }
//     );

//     // Remove learning path from all learners' enrolledPaths
//     await Learner.updateMany(
//       { enrolledPaths: id },
//       { $pull: { enrolledPaths: id } }
//     );


//     // Delete the learning path
//     await LearningPath.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: 'Learning path deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting learning path:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting learning path',
//       error: error.message
//     });
//   }
// };

// // server/controller/learningPathController.js

// export const updateLearningPath = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, category, level, price, duration, code } = req.body;

//     // Validate Learning Path ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid Learning Path ID." });
//     }

//     // Fetch learning path
//     const learningPath = await LearningPath.findById(id);
//     if (!learningPath) {
//       return res.status(404).json({ success: false, message: "Learning path not found." });
//     }

//     // Authorization
//     if (learningPath.createdBy.toString() !== req.userId) {
//       return res.status(403).json({ success: false, message: "Not authorized to update this path." });
//     }

//     // Update top-level fields
//     learningPath.title = title || learningPath.title;
//     learningPath.description = description || learningPath.description;
//     learningPath.category = category || learningPath.category;
//     learningPath.level = level || learningPath.level;
//     learningPath.price = price !== undefined ? price : learningPath.price;
//     learningPath.duration = duration || learningPath.duration;
//     if (code) learningPath.code = code;

//     // Parse incoming content
//     let incomingContent = [];
//     if (req.body.content) {
//       try {
//         incomingContent = JSON.parse(req.body.content);
//         if (!Array.isArray(incomingContent)) throw new Error("Content must be an array.");
//       } catch (e) {
//         return res.status(400).json({ success: false, message: e.message || "Invalid content format." });
//       }
//     }

//     // Process each module
//     for (let index = 0; index < incomingContent.length; index++) {
//       const moduleData = incomingContent[index];

//       // Check if module exists
//       let module = learningPath.content.find(m => m._id.toString() === moduleData._id);

//       if (module) {
//         // Update existing module
//         module.title = moduleData.title || module.title;
//         module.description = moduleData.description || module.description;
//         module.duration = moduleData.duration || module.duration;
//       } else {
//         // Add new module
//         module = {
//           _id: new mongoose.Types.ObjectId(),
//           title: moduleData.title,
//           description: moduleData.description,
//           duration: moduleData.duration,
//           resources: [],
//         };
//       }

//       // Handle file uploads for this module
//       const fileTypes = ["video", "pdf", "bibtex", "excel", "additionalFiles"];
//       for (const type of fileTypes) {
//         const files = req.files?.filter(f => f.fieldname.includes(`content[${index}][files][${type}]`)) || [];

//         for (const file of files) {
//           try {
//             const uploadType = type === "video" ? "video" : "auto";
//             const uploadResult = await uploadFile(file.path, uploadType);
//             console.log(uploadResult.url)
//             if (uploadResult?.url) {
//               module.resources.push({
//                 fileUrl: uploadResult.url,
//                 fileType: type === "additionalFiles" ? "additional" : type,
//                 fileName: file.originalname,
//                 publicId: uploadResult.publicId,
//                 format: uploadResult.format || "file",
//                 size: uploadResult.bytes || null,
//               });
//             }
//           } catch (err) {
//             console.error("Error uploading file to Cloudinary:", file.originalname, err.message);
//           }
//         }
        
//       }
//       learningPath.content.push(module);
//     }

//     // Recalculate total hours
//     learningPath.totalHours = learningPath.content.reduce((total, item) => {
//       const hours = parseFloat(String(item.duration || "0").replace(/[^0-9.]/g, "")) || 0;
//       return total + hours;
//     }, 0);

//     // Save the updated learning path
//     await learningPath.save();

//     res.status(200).json({
//       success: true,
//       message: "Learning path updated successfully!",
//       learningPath,
//     });
//   } catch (error) {
//     console.error("Error updating learning path:", error);
//     res.status(500).json({
//       success: false,
//       message: "An internal server error occurred.",
//       error: error.message,
//     });
//   }
// };





// export const deleteModuleByTitle = async (req, res) => {
//   try {
//     const { pathId } = req.params;
//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({ success: false, message: "Module title is required." });
//     }

//     const learningPath = await LearningPath.findById(pathId);
//     if (!learningPath) {
//       return res.status(404).json({ success: false, message: "Learning path not found." });
//     }

//     // Check ownership
//     if (learningPath.createdBy.toString() !== req.userId) {
//       return res.status(403).json({ success: false, message: "Not authorized to modify this path." });
//     }

//     const initialModuleCount = learningPath.content.length;
//     // Filter out the module with the matching title
//     learningPath.content = learningPath.content.filter(module => module.title !== title);

//     if (learningPath.content.length === initialModuleCount) {
//       return res.status(404).json({ success: false, message: `Module with title "${title}" not found.` });
//     }

//     // Recalculate total hours
//     learningPath.totalHours = learningPath.content.reduce((total, item) => {
//       const durationStr = item.duration || "0";
//       const hours = parseFloat(durationStr.replace(/[^0-9.]/g, "")) || 0;
//       return total + hours;
//     }, 0);

//     await learningPath.save();

//     res.json({
//       success: true,
//       message: "Module deleted successfully.",
//       learningPath,
//     });
//   } catch (error) {
//     console.error("Error deleting module:", error);
//     res.status(500).json({ success: false, message: "Server error while deleting module.", error: error.message });
//   }
// };


import LearningPath from "../models/learningPath.js";
import { uploadFile } from "../config/cloudinary.js";
import Learner from "../models/learner.js"
import mongoose from "mongoose";
import Teacher from '../models/teacher.js';
import {
  uploadImage,
  
} from '../config/cloudinary.js';



export const createLearningPath = async (req, res) => {
  try {
    const {
      title,
      description,
      isPrivate,
      code,
      learners,
      category,
      price,
      level,
      duration,
      content,
    } = req.body;

    const teacherId = req.userId;
    let image = null;

    // ✅ Upload the course image if present
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find((file) => file.fieldname === "pathImage");
      if (imageFile) {
        const uploadedImage = await uploadImage(imageFile.path);
        image = uploadedImage.secure_url;
      }
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;
    const processedContent = [];

    for (let i = 0; i < parsedContent.length; i++) {
      const moduleData = parsedContent[i];
      // Find descriptions for files in this module
      const fileDescriptions = moduleData.fileDescriptions || [];

      const newModule = {
        title: moduleData.title || "",
        description: moduleData.description || "",
        duration: parseFloat(moduleData.duration || 0),
        urls: Array.isArray(moduleData.urls)
          ? moduleData.urls
          : moduleData.urls
          ? [moduleData.urls]
          : [],
        resources: [],
      };

      // ✅ Filter all files belonging to this module
      const moduleFiles = req.files.filter(
        (f) =>
          f.fieldname.startsWith(`content[${i}]`) ||
          f.fieldname === `content[${i}][files]`
      );

      // ✅ Upload all files in Cloudinary
      for (const file of moduleFiles) {
        try {
          const uploadResult = await uploadFile(file.path, "auto");
          
          // Find description for this file
          const descObj = fileDescriptions.find(d => d.fileName === file.originalname);
          const fileDescription = descObj ? descObj.description : "";

          newModule.resources.push({
            fileUrl: uploadResult.url,
            fileName: file.originalname,
            fileType: file.mimetype.split("/")[0],
            format: uploadResult.format,
            size: uploadResult.bytes,
            publicId: uploadResult.publicId,
            description: fileDescription, // <-- Added description
          });
        } catch (error) {
          console.error("File upload failed:", error.message);
        }
      }

      processedContent.push(newModule);
    }

    const newLearningPath = new LearningPath({
      title,
      description,
      category,
      price,
      level,
      duration,
      image, // ✅ Now properly stored
      isPrivate: isPrivate || false,
      learners: learners || [],
      code: code || "",
      createdBy: teacherId,
      content: processedContent,
      totalHours: 0,
      revenue: 0,
    });

    await newLearningPath.save();

    // ✅ Update teacher’s created paths
    await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { createdPaths: newLearningPath._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Learning Path created successfully",
      learningPath: newLearningPath,
    });
  } catch (error) {
    console.error("Error creating learning path:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create learning path", error: error.message });
  }
};



// 🧠 Get all learning paths for the authenticated teacher
export const getTeacherLearningPaths = async (req, res) => {
  try {
    const teacherId = req.userId;
    const learningPaths = await LearningPath.find({
        createdBy: req.userId
      })
      .populate('createdBy', 'name email')
      .sort({
        createdAt: -1
      });

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

// 🧠 Get all learning paths (for learners or admin)
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

// 🧠 Get single path by ID
export const learningPathById = async (req, res) => {
  try {
    const {
      id
    } = req.params; // use params instead of body
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

// 🧠 Update learning path
export const updateLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, level, duration, content } = req.body;
    const parsedContent = typeof content === "string" ? JSON.parse(content) : content;

    const path = await LearningPath.findById(id);
    if (!path) return res.status(404).json({ message: "Learning path not found" });

    path.title = title || path.title;
    path.description = description || path.description;
    path.category = category || path.category;
    path.price = price || path.price;
    path.level = level || path.level;
    path.duration = duration || path.duration;

    for (let i = 0; i < parsedContent.length; i++) {
      const moduleData = parsedContent[i];
      const fileDescriptions = moduleData.fileDescriptions || []; // Get descriptions
      let module = path.content[i] || {};

      module.title = moduleData.title || module.title;
      module.description = moduleData.description || module.description;
      module.duration = parseFloat(moduleData.duration || module.duration || 0);
      module.urls = Array.isArray(moduleData.urls)
        ? moduleData.urls
        : moduleData.urls
        ? [moduleData.urls]
        : module.urls || [];

      // Handle new uploads
      const moduleFiles = req.files.filter(
        (f) =>
          f.fieldname.startsWith(`content[${i}]`) ||
          f.fieldname === `content[${i}][files]`
      );

      if (!module.resources) module.resources = [];

      for (const file of moduleFiles) {
        try {
          const uploadResult = await uploadFile(file.path, "auto");
          
          // Find description for this file
          const descObj = fileDescriptions.find(d => d.fileName === file.originalname);
          const fileDescription = descObj ? descObj.description : "";
          
          module.resources.push({
            fileUrl: uploadResult.url,
            fileName: file.originalname,
            fileType: file.mimetype.split("/")[0],
            format: uploadResult.format,
            size: uploadResult.bytes,
            publicId: uploadResult.publicId,
            description: fileDescription, // <-- Added description
          });
        } catch (error) {
          console.error("File upload failed:", error.message);
        }
      }

      path.content[i] = module;
    }

    await path.save();
    res.json({ message: "Learning path updated successfully", path });
  } catch (error) {
    console.error("Error updating learning path:", error.message);
    res.status(500).json({ message: "Failed to update learning path", error: error.message });
  }
};
// 🧠 Delete a learning path
export const deleteLearningPath = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.userId;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid path ID" });
    }

    const deletedPath = await LearningPath.findByIdAndDelete(id);
    if (!deletedPath) {
      return res.status(404).json({ success: false, message: "Learning path not found" });
    }

    // ✅ Remove reference from Teacher
    await Teacher.findByIdAndUpdate(
      teacherId,
      { $pull: { createdPaths: id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Learning path deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting learning path",
      error: error.message,
    });
  }
};

// 🧠 Delete a module by title
export const deleteModuleByTitle = async (req, res) => {
  try {
    const { pathId } = req.params;
    const { title } = req.body;

    const path = await LearningPath.findById(pathId);
    if (!path) return res.status(404).json({ message: "Path not found" });

    path.content = path.content.filter((module) => module.title !== title);
    await path.save();

    res.json({ message: "Module deleted successfully", path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete module" });
  }
};

// Delete an document
// DELETE /api/learningpaths/:pathId/modules/:moduleId/resources/:resourceId
export const deleteModuleResource = async (req, res) => {
  try {
    const { pathId, moduleId, resourceId } = req.params;

    const path = await LearningPath.findById(pathId);
    if (!path) return res.status(404).json({ success: false, message: "Path not found" });

    const module = path.content.id(moduleId);
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });

    // Filter out the resource
    module.resources = module.resources.filter((r) => r._id.toString() !== resourceId);

    await path.save();

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ success: false, message: "Server error while deleting resource" });
  }
};
