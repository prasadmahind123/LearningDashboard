import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import LearningPath from "../models/learningPath.js";

// const genAI = new GoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// helper: download file buffer
const downloadFileBuffer = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return res.data;
};

export const describeDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // find document inside LearningPath
    const learningPath = await LearningPath.findOne({ "content.resources._id": id });
    if (!learningPath)
      return res.status(404).json({ message: "Document not found in any path." });

    let targetResource = null;
    for (const module of learningPath.content) {
      const resDoc = module.resources.find((r) => r._id.toString() === id);
      if (resDoc) {
        targetResource = resDoc;
        break;
      }
    }

    if (!targetResource)
      return res.status(404).json({ message: "Resource not found in modules." });

    const fileUrl = targetResource.fileUrl;
    const fileType =  "application/pdf";
    const fileName = targetResource.fileName || "document";


    // download file buffer
    const fileBuffer = await downloadFileBuffer(fileUrl);

    // create Gemini input
    const contents = [
      { text: "Summarize this document for students in simple language." },
      {
        inlineData: {
          mimeType: fileType,
          data: Buffer.from(fileBuffer).toString("base64"),
        },
      },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents
    });

    // 3. Get the response and text
    const summary = response.text;
    

    res.json({
      success: true,
      summary,
      documentTitle: fileName,
      documentType: fileType,
    });
  } catch (error) {
    console.error("Error summarizing document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to summarize document",
      error: error.message,
    });
  }
};