import Layout from "@/components/Layout";
import axios from "axios";
import { Router, useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProduct, setGoToProduct] = useState(false);
  const router = useRouter();
  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    console.log(data);
    try {
      await axios.post("/api/products", data);
      setGoToProduct(true);
    } catch (error) {
      console.log(error.message);
    }
  }
  if (goToProduct) {
    router.push("/products");
  }
  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        ></input>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
        <label>Price(in USD)</label>
        <input
          type="text"
          placeholder="price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        ></input>
        <button className="btn-primary" type="submit">
          Save
        </button>
      </form>
    </Layout>
  );
}
