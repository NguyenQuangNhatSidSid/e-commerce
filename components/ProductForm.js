import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploadinng, setIsUploading] = useState(false);
  const router = useRouter();

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price, images };

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

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
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
                  className="h-24 rounded-lg"
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

        <label className="bg-gray-200 cursor-pointer w-24 h-24 text-center justify-center flex items-center text-sm text-gray-500 gap-1 rounded-lg">
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
          <div>Upload</div>
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
