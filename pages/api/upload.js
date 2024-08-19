import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import multiparty from "multiparty";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

export default async function handle(req, res) {
  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const urls = [];

  for (const file of files.file) {
    const filePath = file.path;
    const ext = path.extname(file.originalFilename);
    const newFilename = `${Date.now()}${ext}`;
    const fileBuffer = await fs.readFile(filePath);

    const fileRef = ref(storage, `images/${newFilename}`);
    const metadata = {
      contentType: mime.lookup(filePath),
    };

    try {
      await uploadBytes(fileRef, fileBuffer, metadata);
      const downloadURL = await getDownloadURL(fileRef);
      urls.push(downloadURL);
      await fs.unlink(filePath); // Clean up the temp file
    } catch (error) {
      return res.status(500).json({ message: "Upload failed", error });
    }
  }

  res.status(200).json({ links: urls });
}

export const config = {
  api: { bodyParse: false },
};
