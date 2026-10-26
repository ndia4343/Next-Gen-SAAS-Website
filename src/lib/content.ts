import fs from "fs/promises";
import path from "path";
import { WebsiteContent, WebsiteContentSchema } from "./types";
import { initialContent } from "@/data/initial-content";

const CONTENT_FILE_PATH = path.join(process.cwd(), "src", "data", "content.json");

/**
 * Retrieve current website content from disk.
 * Falls back automatically to initialContent if the file does not exist or fails validation.
 */
export async function getWebsiteContent(): Promise<WebsiteContent> {
  try {
    const rawData = await fs.readFile(CONTENT_FILE_PATH, "utf-8");
    const parsedJson = JSON.parse(rawData);
    const validationResult = WebsiteContentSchema.safeParse(parsedJson);

    if (validationResult.success) {
      return validationResult.data;
    } else {
      console.warn(
        "Content schema validation failed. Falling back to initialContent.",
        validationResult.error.format()
      );
      return initialContent;
    }
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      // Content file does not exist yet. Seed it with initialContent.
      try {
        await writeWebsiteContent(initialContent);
      } catch (writeErr) {
        console.error("Failed to seed initial content file:", writeErr);
      }
      return initialContent;
    }

    console.error("Unexpected error reading website content:", error);
    return initialContent;
  }
}

/**
 * Write updated website content atomically to disk.
 */
export async function writeWebsiteContent(content: WebsiteContent): Promise<void> {
  // 1. Validate payload against Zod schema
  const validatedContent = WebsiteContentSchema.parse(content);
  const dataDir = path.dirname(CONTENT_FILE_PATH);

  // 2. Ensure parent directory exists
  await fs.mkdir(dataDir, { recursive: true });

  const tempFilePath = `${CONTENT_FILE_PATH}.tmp.${Date.now()}`;
  const serialized = JSON.stringify(validatedContent, null, 2);

  try {
    // 3. Write to temporary file first
    await fs.writeFile(tempFilePath, serialized, "utf-8");

    // 4. Atomically rename/replace target file
    try {
      await fs.rename(tempFilePath, CONTENT_FILE_PATH);
    } catch {
      // On Windows filesystems, rename over an existing file can throw EPERM/EEXIST
      await fs.copyFile(tempFilePath, CONTENT_FILE_PATH);
      await fs.unlink(tempFilePath).catch(() => {});
    }
  } catch (error) {
    // Clean up temporary file if write fails
    await fs.unlink(tempFilePath).catch(() => {});
    throw error;
  }
}
