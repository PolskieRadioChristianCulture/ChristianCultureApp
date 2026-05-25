import * as pdfjsLib from "pdfjs-dist";
// Use a direct unpkg link or similar for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const extractTextFromPdf = async (fileBlob: Blob): Promise<string> => {
  try {
    const arrayBuffer = await fileBlob.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";
    
    // Extract text from up to 50 pages to keep it within reasonable limits
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n\n";
    }
    return fullText;
  } catch (error) {
    console.error("Error extracting PDF text", error);
    return "";
  }
}
