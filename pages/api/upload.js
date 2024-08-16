import cloudinary from "@/lib/cloudinary";
import multiparty from "multiparty";

export default async function handle(req, res) {
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    const file = files.file[0];
    const path = file.path;
    try {
      const result = await cloudinary.uploader.upload(path, {
        folder:
          "https://console.cloudinary.com/console/c-32ce8bdf5a797d8b54a4512e021775/media_library/folders/c8ad35c7400944804c74cc94fd184219f8",
      });
      // Delete the temporary file
      await fs.unlink(path);

      // Send back the URL of the uploaded image
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: "Image upload failed", error });
    }
    // console.log("length: ", files.file.length);
    // res.json("ok");
  });
}

export const config = {
  api: { bodyParse: false },
};
