import { Request, Response } from "express";
import { searchDrive } from "./driveUtils";
import { summaryPrompt } from "../../ai/summaryPrompt";

export async function searchHandler(req: Request, res: Response) {
  const { query } = req.params;
  
  try {
    const files = await searchDrive(query);

    console.log(files);

    const topDocuments = files.map((file: { name: string; webViewLink: string }) => ({
      title: file.name,
      url: file.webViewLink,
    }));

    const mockSummary = await summaryPrompt(query, topDocuments);

    res.json({
      summary: mockSummary,
      topDocuments: topDocuments
    });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "An error occurred during the search" });
  }
}