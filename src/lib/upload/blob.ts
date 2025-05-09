import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

interface UploadResult {
  url: string;
  filename: string;
  source: "vercel" | "local";
}

export async function uploadMedia(file: File): Promise<UploadResult> {
  const extension = file.name.split(".").pop();
  const filename = `${randomUUID()}.${extension}`;

  const bytes = await file.arrayBuffer();

  // local
  if (process.env.VERCEL !== "1") {
    const buffer = Buffer.from(bytes);
    const localPath = path.join(process.cwd(), "public", "tmp", filename);

    await writeFile(localPath, buffer);

    return {
      url: `/tmp/${filename}`,
      filename,
      source: "local",
    };
  }

  // prod
  const blob = await put(filename, file, {
    access: "public",
  });

  return {
    url: blob.url,
    filename: blob.pathname,
    source: "vercel",
  };
}
