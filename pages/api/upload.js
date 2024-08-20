import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multiparty from "multiparty";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

export default async function handle(req, res) {
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Form parsing error:", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const urls = await Promise.all(
      files.file.map(async (file) => {
        const ext = path.extname(file.originalFilename);
        const newFilename = `${Date.now()}${ext}`;
        const fileBuffer = await fs.readFile(file.path);
        const fileRef = ref(storage, `images/${newFilename}`);
        const metadata = { contentType: mime.lookup(file.path) };

        await uploadBytes(fileRef, fileBuffer, metadata);
        await fs.unlink(file.path); // Clean up the temp file

        return getDownloadURL(fileRef);
      })
    );

    res.status(200).json({ links: urls });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
}

// Important: Disable body parsing for this route
export const config = {
  api: { bodyParser: false },
};
