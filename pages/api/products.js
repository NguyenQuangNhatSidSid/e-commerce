import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res, next) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.status(200).json(await Product.find());
  }

  if (method === "POST") {
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
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
