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
      { text: `
        Analyze this document and:
        - Summarize it in simple terms
        - Highlight key concepts
        - List important points
        - Suggest who should study this (beginner/intermediate)
      `},
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
    You are "EduBot", an intelligent AI assistant for the EduPlatform.

    You help both students and teachers with:
    1. Answering educational questions (programming, concepts, theory, etc.)
    2. Helping users understand how to use the platform
    3. Recommending learning paths when relevant

    You have access to available courses:
    ${courseContext}

    Guidelines:
    - If user asks educational questions → explain clearly in simple language
    - If user asks platform-related questions → guide step-by-step
    - If user asks about courses → use the provided data
    - You are NOT limited to course data; you can use general knowledge
    - Keep answers friendly, clear, and structured
    - If unsure, say you’ll try your best instead of refusing
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