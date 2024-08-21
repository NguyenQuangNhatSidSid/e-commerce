import { Category } from "@/models/Category";
import mongooseConnect from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  try {
    if (method === "POST") {
      const { name } = req.body;
      const categoryDoc = await Category.create({ name });
      res.status(201).json(categoryDoc);
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
