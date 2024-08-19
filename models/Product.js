import { types } from "mime-types";
import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: String, required: true },
  image: [{ type: String }],
});
export const Product = models.Product || model("Product", ProductSchema);
