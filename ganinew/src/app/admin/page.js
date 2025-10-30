"use client";
import { useState, useEffect } from "react";
import ManagePage from "./managepost/page";
import ManageReport from "./managereport/page";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Page() {
  const [pageshow, setPageshow] = useState("managepost");
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);

  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/checkAdminUser");
        if (res.status === 403) {
          setIsAdmin(false);
          router.push("/");
        }

        if (res.ok) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.log("Error is:", err);
      }
    })();
    const storedPage = localStorage.getItem("pageshow");
    if (storedPage) setPageshow(storedPage);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("pageshow", pageshow);
  }, [pageshow, mounted]);

  if (!mounted) return null;

  if (isAdmin === null) return (<div> <Loading/> </div>);

  return (
    <div>
      {isAdmin ? (
        <>
          <div className="flex mt-2">
            <button
              onClick={() => setPageshow("managepost")}
              className="w-64 flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-6 shadow-md hover:text-white hover:bg-violet-500 hover:shadow-lg transition duration-300 cursor-pointer"
            >
              Manage Post
            </button>

            <button
              onClick={() => setPageshow("managereport")}
              className="w-64 flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-6 shadow-md hover:text-white hover:bg-violet-500 hover:shadow-lg transition duration-300 cursor-pointer"
            >
              Manage Report
            </button>
            <button
              onClick={() => router.push(`/admin/createpost`)}
              className="w-64 flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-6 shadow-md hover:text-white hover:bg-green-400 hover:shadow-lg transition duration-300 cursor-pointer"
            >
              + Create Post
            </button>
          </div>
          { isAdmin? (<div>
            {pageshow === "managepost" ? <ManagePage /> : <ManageReport />}
          </div>) : <Loading/> }
        </>
      ) : (
        <div className="text-center mt-10 text-red-500 font-bold text-2xl">
          Access Denied. You are not admin user.
        </div>
      )}
    </div>
  );
}
