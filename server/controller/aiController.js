import axios from "axios";
import mammoth from "mammoth";
import { PDFParse } from 'pdf-parse';;
import { OpenAI } from "openai";
import LearningPath from "../models/learningPath.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// helper: download file buffer
const downloadFileBuffer = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return res.data;
};

// helper: extract text from file buffer
const extractText = async (buffer, mimeType) => {
  try {
    if (mimeType.includes("pdf")) {
      const data = new PDFParse({url : buffer})
      let result = await data.getText();
      return result;
    } else if (mimeType.includes("word") || mimeType.includes("officedocument")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (mimeType.includes("text") || mimeType.includes("plain")) {
      return buffer.toString("utf-8");
    } else {
      return "File format not supported for text extraction.";
    }
  } catch (err) {
    console.error("Error extracting text:", err);
    return "";
  }
};

// 🧠 Main Controller
export const describeDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the resource inside any LearningPath
    const learningPath = await LearningPath.findOne({
      "content.resources._id": id,
    });
    if (!learningPath)
      return res
        .status(404)
        .json({ message: "Document not found in any learning path." });

    // Find the exact resource
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
    const fileType = targetResource.fileType || "application/pdf";

    // Download and extract text
    const fileBuffer = await downloadFileBuffer(fileUrl);
    const text = await extractText(fileUrl, fileType);

    if (!text || text.length < 50) {
      console.warn("⚠️ Document too short for summary. Returning mock data.");
      return res.json({
        success: true,
        summary:
          "📄 [Mock Summary] The uploaded document appears to be short or unsupported. This is a placeholder summary generated for display purposes.",
        documentTitle: targetResource.fileName,
        documentType: fileType,
      });
    }

    // Summarize using OpenAI
    const prompt = `
You are a helpful AI assistant. Summarize this document in simple and clear language
for learners. Focus on explaining key points and making it easy to understand.
Document text:

    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const summary = completion.choices[0].message.content;

      res.json({
        success: true,
        summary,
        documentTitle: targetResource.fileName,
        documentType: fileType,
      });
    } catch (aiError) {
      console.warn("⚠️ OpenAI unavailable or quota exceeded:", aiError.message);
      // Fallback mock summary
      res.json({
        success: true,
        summary:
          "🤖 [Offline AI Mode] The AI summarization service is currently unavailable. This is a temporary placeholder summary to help you continue testing the feature.",
        documentTitle: targetResource.fileName,
        documentType: fileType,
      });
    }
  } catch (error) {
    console.error("AI describe error:", error);
    res.status(500).json({
      message: "Failed to generate AI summary",
      error: error.message,
    });
  }
};
