import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res, next) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.status(200).json(await Product.find());
    }
  } else if (method === "POST") {
    try {
      const { title, description, price } = req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
      });
      res.status(201).json(productDoc);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (method === "PUT") {
    try {
      const { title, description, price, _id } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { title, description, price },
        { new: true }
      );
      if (!updatedProduct) {
        res.status(404).json({ message: " Product not found" });
      } else {
        res.status(200).json(updatedProduct);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (method === "DELETE") {
    try {
      if (req.query?.id) {
        await Product.findByIdAndDelete({ _id: req.query?.id });
        res.status(200).json("delete successfull");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
