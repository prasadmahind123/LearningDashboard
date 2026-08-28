
import LearningPath from "../models/learningPath.js";
import { uploadFile } from "../config/cloudinary.js";
import Learner from "../models/learner.js"
import mongoose from "mongoose";
import Teacher from '../models/teacher.js';
import {
  uploadImage,
  
} from '../config/cloudinary.js';
import XLSX from "xlsx";
import bibtexParse from "bibtex-parse-js";
import fs from "fs";



export const createLearningPath = async (req, res) => {
  try {
    const {
      title,
      description,
      // isPrivate,
      code,
      learners,
      category,
      // price,
      level,
      duration,
      content,
      skills
    } = req.body;

    const parsedSkills =
      typeof skills === "string" ? JSON.parse(skills) : skills;


    const teacherId = req.userId;

    const teacher = await Teacher.findById(teacherId);

    // Limit check: 5 paths for non-subscribed users
    if (!teacher.isSubscribed && teacher.createdPaths.length >= 5) {
      return res.status(403).json({ 
        success: false, 
        message: "Free plan limit reached. You can only create 5 paths. Please upgrade to Premium for unlimited access.",
        requiresSubscription: true
      });
    }

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
      // price,
      level,
      duration,
      image, // ✅ Now properly stored
      //isPrivate: isPrivate || false,
      learners: learners || [],
      skills: parsedSkills || [],
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
      .populate('createdBy', 'name email bio')
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
      .populate("createdBy", "fullName email createdPaths expertise bio enrolledStudents") // optional, show teacher info
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
    const learningPath = await LearningPath.findById(id).populate("createdBy", "fullName email createdPaths expertise bio enrolledStudents");

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

    // Store old module IDs before modification
    const oldModuleIds = path.content.map(m => m._id?.toString());

    // --- Update main details ---
    path.title = title || path.title;
    path.description = description || path.description;
    path.category = category || path.category;
    // path.price = price || path.price;
    path.level = level || path.level;
    path.duration = duration || path.duration;

    // --- Handle modules ---
    for (let i = 0; i < parsedContent.length; i++) {
      const moduleData = parsedContent[i];
      const fileDescriptions = moduleData.fileDescriptions || [];
      let module = path.content[i] || {};

      module.title = moduleData.title || module.title;
      module.description = moduleData.description || module.description;
      module.duration = parseFloat(moduleData.duration || module.duration || 0);
      module.urls = Array.isArray(moduleData.urls)
        ? moduleData.urls
        : moduleData.urls
        ? [moduleData.urls]
        : module.urls || [];

      const moduleFiles = req.files.filter(
        (f) =>
          f.fieldname.startsWith(`content[${i}]`) ||
          f.fieldname === `content[${i}][files]`
      );

      if (!module.resources) module.resources = [];

      for (const file of moduleFiles) {
        try {
          const uploadResult = await uploadFile(file.path, "auto");
          const descObj = fileDescriptions.find(d => d.fileName === file.originalname);
          const fileDescription = descObj ? descObj.description : "";

          module.resources.push({
            fileUrl: uploadResult.url,
            fileName: file.originalname,
            fileType: file.mimetype.split("/")[0],
            format: uploadResult.format,
            size: uploadResult.bytes,
            publicId: uploadResult.publicId,
            description: fileDescription,
          });
        } catch (error) {
          console.error("File upload failed:", error.message);
        }
      }

      path.content[i] = module;
    }

    await path.save();

    // --- 🔁 Sync Learners ---
    const newModuleIds = path.content.map(m => m._id?.toString());
    const removedModules = oldModuleIds.filter(id => !newModuleIds.includes(id));
    const addedModules = newModuleIds.filter(id => !oldModuleIds.includes(id));

    if (removedModules.length > 0 || addedModules.length > 0) {
      const learners = await Learner.find({ "enrolledPaths.pathId": id });

      for (const learner of learners) {
        const enrolledPath = learner.enrolledPaths.find(
          p => p.pathId.toString() === id
        );
        if (!enrolledPath) continue;

        // ✅ Remove deleted module IDs
        enrolledPath.totalModules = enrolledPath.totalModules.filter(
          mId => !removedModules.includes(mId.toString())
        );

        enrolledPath.completedModules = enrolledPath.completedModules.filter(
          mId => !removedModules.includes(mId.toString())
        );

        // ✅ Add new module IDs (only if not already present)
        for (const newId of addedModules) {
          if (!enrolledPath.totalModules.some(m => m.toString() === newId)) {
            enrolledPath.totalModules.push(newId);
          }
        }

        // ✅ Recalculate progress
        const total = enrolledPath.totalModules.length;
        const completed = enrolledPath.completedModules.length;
        enrolledPath.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

        await learner.save();
      }
    }

    res.json({ message: "Learning path updated successfully", path });
  } catch (error) {
    console.error("Error updating learning path:", error.message);
    res.status(500).json({
      message: "Failed to update learning path",
      error: error.message,
    });
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

    // ✅ Find path before deleting
    const path = await LearningPath.findById(id);
    if (!path) {
      return res.status(404).json({ success: false, message: "Learning path not found" });
    }

    // ✅ Ensure only the owner teacher can delete
    if (path.createdBy.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this learning path" });
    }

    // ✅ 1. Remove path from teacher’s createdPaths
    await Teacher.findByIdAndUpdate(
      teacherId,
      { $pull: { createdPaths: id } },
      { new: true }
    );

    // ✅ 2. Remove path from all learners’ enrolledPaths
    await Learner.updateMany(
      { "enrolledPaths.pathId": id },
      { $pull: { enrolledPaths: { pathId: id } } }
    );

    // ✅ 3. Delete the learning path document itself
    await LearningPath.findByIdAndDelete(id);

    // ✅ 4. Optionally recalc teacher’s total path count (if you store it separately)
    const updatedTeacher = await Teacher.findById(teacherId);
    const totalPaths = updatedTeacher.createdPaths.length;

    res.status(200).json({
      success: true,
      message: "Learning path deleted successfully",
      totalPaths, // updated count
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

// 🧠 Import learning path from Excel
export const importLearningPathFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet);


    const modulesMap = {};

    rows.forEach((row) => {
      const moduleName = row.Module?.trim();
      const type = row.Type?.trim() || "video";
      const url = row.URL?.trim();

      if (!moduleName) return;

      if (!modulesMap[moduleName]) {
        modulesMap[moduleName] = {
          title: moduleName,
          description: "",
          duration: "",
          type,
          urls: [],
          files: {
            documents: [],
            video: null,
            pdf: null,
            bibtex: null,
            excel: null,
            additionalFiles: [],
          },
        };
      }

      if (url) {
        modulesMap[moduleName].urls.push(url);
      }
    });

    const modules = Object.values(modulesMap).map((module) => ({
      title: module.title || "",
      description: module.description,
      duration: module.duration,
      type: module.type,

      // ✅ EXACT FORMAT YOUR FORM EXPECTS
      urls: module.urls.length ? module.urls : [""],

      files: module.files,
    }));

    fs.unlinkSync(req.file.path);

    res.json({ modules });

  } catch (err) {
    console.error("Excel import error:", err);
    res.status(500).json({ error: "Excel parsing failed" });
  }
};


export const importLearningPathFromBibtex = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const bibtexContent = fs.readFileSync(req.file.path, "utf8");
    const entries = bibtexParse.toJSON(bibtexContent);

    const modules = entries.map((entry) => {
      const tags = entry.entryTags || {};

      const title = tags.title || tags.booktitle || "Untitled Resource";
      const url   = tags.url   || tags.link      || "";

      // Priority: abstract → note → annote → empty string
      const description =
        tags.abstract ||
        tags.note     ||
        tags.annote   ||
        tags.description  ||
        "";

      return {
        title,
        description,
        duration: "",
        type: "reading",
        urls: url ? [url] : [""],
        files: {
          documents:       [],
          video:           null,
          pdf:             null,
          bibtex:          null,
          excel:           null,
          additionalFiles: [],
        },
      };
    });

    fs.unlinkSync(req.file.path);

    return res.json({ modules });
  } catch (err) {
    console.error("[importLearningPathFromBibtex]", err);
    return res.status(500).json({ error: "BibTeX parsing failed" });
  }
};
