import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if ("") {
    console.log("hello world");
  }

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello,
          <b> {session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt={session?.user?.name || "user image"}
            className="w-6 h-6 rounded-full overflow-hidden"
          />
          <span className="py-1 px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
