'use client'
import { useState, useEffect } from "react"
import ManagePage from "./managepost/page"
import ManageReport from "./managereport/page"
import { useRouter } from 'next/navigation';

export default function Page() {
    const [pageshow, setPageshow] = useState("managepost");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const storedPage = localStorage.getItem("pageshow");
        if (storedPage) setPageshow(storedPage);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem("pageshow", pageshow);
    }, [pageshow, mounted]);

    if (!mounted) return null

    return (
        <div>
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

            <div>
                {pageshow === "managepost" ? (
                    <ManagePage/>
                ) : (
                    <ManageReport/>
                )}
            </div>
        </div>
    )
}
