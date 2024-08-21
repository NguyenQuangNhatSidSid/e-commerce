import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");

  async function saveCategory(ev) {
    ev.preventDefault();
    try {
      await axios.post("/api/categories", { name });
      setName("");
    } catch (error) {
      console.error("Error processing request:", error);
    }
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category name</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          className="mb-0"
          placeholder={"Category name"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <td>Category name</td>
          </tr>
        </thead>
      </table>
    </Layout>
  );
}
