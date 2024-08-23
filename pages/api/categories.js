import { Category } from "@/models/Category";
import mongooseConnect from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  try {
    if (method === "POST") {
      const { name, parentCategory } = req.body;
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory,
      });
      res.status(201).json(categoryDoc);
    } else if (method === "GET") {
      const categoryDoc = await Category.find().populate("parent");
      res.status(201).json(categoryDoc);
    } else if (method === "PUT") {
      const { name, parentCategory, _id } = req.body;
      const categoryDoc = await Category.findOneAndUpdate(
        { _id },
        {
          name,
          parent: parentCategory,
        }
      );
      res.status(201).json(categoryDoc);
    } else if (method === "DELETE") {
      const { _id } = req.query;
      await Category.findOneAndDelete({ _id });
      res.status(201).json("Delete successful");
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
