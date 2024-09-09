import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [productProperties, setproductProperties] = useState(
    assignedProperties || {}
  );
  const [category, setCategory] = useState(assignedCategory || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploadinng, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    try {
      if (_id) {
        await axios.put("/api/products", { ...data, _id });
      } else {
        await axios.post("/api/products", data);
      }
      setGoToProduct(true);
    } catch (error) {
      console.log("Error saving product:", error.message);
    }
  }

  if (goToProduct) {
    router.push("/products");
  }

  async function upLoadImages(ev) {
    try {
      const files = ev.target?.files;

      if (!files?.length) {
        return;
      }
      setIsUploading(true);
      const data = new FormData();

      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    } catch (error) {
      console.log("Error uploading images:", error.message);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);

    if (catInfo && Array.isArray(catInfo.properties)) {
      propertiesToFill.push(...catInfo.properties);
    }

    // Directly handle the parent category if it exists
    let parentCat = catInfo?.parent;
    while (parentCat?._id) {
      if (parentCat && Array.isArray(parentCat.properties)) {
        propertiesToFill.push(...parentCat.properties);
      }
      // Move up to the next parent if it exists
      parentCat = parentCat.parent;
    }
  }

  function setProductProp(propName, value) {
    setproductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option>Uncategoriezed</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {categories.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="" key={p._id}>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                key={p._id}
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v._id} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link}>
                <img
                  className="h-24 rounded-lg bg-white p-4 shadow-md border border-gray-100"
                  src={link}
                  alt="Product image"
                />
              </div>
            ))}
        </ReactSortable>
        {isUploadinng && (
          <div className="h-24 p-1 bg-gray-200 flex items-center">
            <Spinner />
          </div>
        )}

        <label className="bg-white flex-col shadow-md border-gray-100 cursor-pointer w-24 h-24 text-center justify-center flex items-center text-sm text-gray-500 gap-1 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={upLoadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price(in USD)</label>
      <input
        type="text"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}
