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

export const chatWithEduBot = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Fetch available learning paths (Public ones) from DB
    // We only select fields relevant to the user to save tokens
    const courses = await LearningPath.find()
      .select("title description category level price duration totalHours rating")
      .lean();

    // 2. Construct the System Prompt / Context
    const courseContext = JSON.stringify(courses);

    
    const systemPrompt = `
      You are "EduBot", a helpful AI assistant for the "EduPlatform" learning dashboard.
      
      Here is the list of currently available learning paths/courses on our platform in JSON format:
      ${courseContext}

      Your instructions:
      1. Answer learner queries based ONLY on the data provided above.
      2. If a user asks for a course recommendation, suggest paths based on their interests (category, level).
      3. If a user asks about prices, mention the specific price or if it's free.
      4. Keep answers concise, encouraging, and friendly.
      5. If the information is not in the data provided, say "I don't have information on that specific topic, but I can help you with our available courses."
    `;

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or gemini-2.0-flash
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }
      ]
    });

    const reply = response.text;

    res.json({ success: true, reply });

  } catch (error) {
    console.error("EduBot Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "EduBot is having trouble thinking right now.",
      error: error.message 
    });
  }
};