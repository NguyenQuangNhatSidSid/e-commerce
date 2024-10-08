import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  try {
    if (method === "GET") {
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id });
        res.json(product);
      } else {
        const products = await Product.find();
        res.status(200).json(products);
      }
    } else if (method === "POST") {
      const { title, description, price, images, category, properties } =
        req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties: productProperties,
      });
      res.status(201).json(productDoc);
    } else if (method === "PUT") {
      const { title, description, price, _id, images, category, properties } =
        req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { title, description, price, images, category, properties },
        { new: true }
      );
      if (!updatedProduct) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json(updatedProduct);
      }
    } else if (method === "DELETE") {
      if (req.query?.id) {
        await Product.findByIdAndDelete(req.query.id);
        res.status(200).json("Delete successful");
      } else {
        res.status(400).json({ message: "Missing product ID" });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
