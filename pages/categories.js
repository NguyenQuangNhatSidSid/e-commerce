import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    await axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    try {
      const data = { name };
      if (parentCategory) {
        data.parentCategory = parentCategory;
      }
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/categories", data);
      } else {
        await axios.post("/api/categories", data);
      }
      setEditedCategory(null);
      setName("");
      setParentCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error processing request:", error);
    }
  }
  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  async function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure ?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "New Category name"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          className="mb-0"
          placeholder={"Category name"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          className="mb-0"
          onChange={(ev) => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option>No parent category</option>
          {categories.length > 0 &&
            categories.map((cate) => (
              <option key={cate._id} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((cate) => (
              <tr key={cate._id}>
                <td>{cate.name}</td>
                <td>{cate?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(cate)}
                    className=" btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cate)}
                    className=" btn-primary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
