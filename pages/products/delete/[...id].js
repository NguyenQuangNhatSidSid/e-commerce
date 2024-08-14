import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    try {
      if (!id) {
        return;
      }
      axios.get("/api/products?id=" + id).then((response) => {
        setProductInfo(response.data);
      });
    } catch (error) {}
  }, [id]);

  function goBack() {
    router.push("/products");
  }

  async function deleteProduct() {
    try {
      if (!id) {
        return;
      }
      await axios.delete("/api/products?id=" + id);
      goBack();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Layout>
      <h1 className="text-center">
        Do you really delete this product &nbsp; `{productInfo?.title}`?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button onClick={goBack} className="btn-default">
          No
        </button>
      </div>
    </Layout>
  );
}
