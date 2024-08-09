import Layout from "@/components/Layout";
import Link from "next/link";

export default function Products() {
  return (
    <Layout>
      <Link className="bg-blue-300 rounded-md py-1 px-2" href={"/products/new"}>
        add
      </Link>
    </Layout>
  );
}
