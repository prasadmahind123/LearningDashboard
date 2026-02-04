import XLSX from "xlsx";
import { toJSON } from "bibtex-parse-js";
import fs from "fs";

// Helper to parse Excel
// Expected Excel Structure:
// Column A: Module Title (e.g., "Intro to React")
// Column B: Resource Title (e.g., "Official Docs")
// Column C: Link (e.g., "https://react.dev")
// Column D: Description
export const parseExcelPath = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const contentMap = {};

  data.forEach((row) => {
    const moduleTitle = row["Module Title"] || "General Resources";
    
    // Initialize module if not exists
    if (!contentMap[moduleTitle]) {
      contentMap[moduleTitle] = {
        title: moduleTitle,
        description: `Resources for ${moduleTitle}`,
        resources: [],
        urls: [] // If you want to store links separately as per your schema
      };
    }

    // Add resource/link
    if (row["Link"]) {
      // If it's a URL, push to urls array or create a link resource
       contentMap[moduleTitle].resources.push({
        fileName: row["Resource Title"] || "External Link",
        fileUrl: row["Link"],
        fileType: "link",
        format: "url",
        description: row["Description"] || ""
      });
    }
  });

  return Object.values(contentMap);
};

// Helper to parse BibTeX
export const parseBibTeXPath = (filePath) => {
  const bibData = fs.readFileSync(filePath, "utf8");
  const entries = toJSON(bibData);

  // Group by Year or Type, or just put all in one "Bibliography" module
  const module = {
    title: "Academic References",
    description: "Imported from BibTeX",
    resources: []
  };

  entries.forEach((entry) => {
    const title = entry.entryTags.title || entry.entryTags.TITLE || "Untitled";
    const author = entry.entryTags.author || entry.entryTags.AUTHOR || "Unknown Author";
    const year = entry.entryTags.year || entry.entryTags.YEAR || "";
    const url = entry.entryTags.url || entry.entryTags.URL || "";

    module.resources.push({
      fileName: `${title} (${year})`,
      fileUrl: url || "#", // BibTeX might not have URLs, handled gracefully
      fileType: "citation",
      format: "bib",
      description: `Author: ${author}. Type: ${entry.entryType}`
    });
  });

  return [module]; // Returns an array with one module containing all refs
};