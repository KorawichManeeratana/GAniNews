'use client'
import Script from "next/script"
import { useEffect, useState } from "react"
import { Scripts } from "react-router-dom"
import Link from "next/link"
import { deletereport, updatereport } from "./action";
export default function ManageReport() {
    const [reports, setReports] = useState([])
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await fetch('/api/reportsfromuser')
                const data = await res.json()
                setReports(data)
            } catch (err) {
                console.log("Error is : ", err)
            }
        }
        fetchdata()
    }, [])



    return (
        <div className="p-6">
            <table className="table-auto border-collapse border border-gray-300 w-full shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                        <th className="border border-gray-300 px-6 py-3 text-center">Subject</th>
                        <th className="border border-gray-300 px-6 py-3 text-center">From User Id</th>
                        <th className="border border-gray-300 px-6 py-3 text-center">Detail</th>
                        <th className="border border-gray-300 px-6 py-3 text-center">CreateAt</th>
                        <th className="border border-gray-300 px-6 py-3 text-center">Status</th>
                        <th className="border border-gray-300 px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                {
                    reports ? (
                        reports.map((i, index) => (
                            <tbody key={index} className="divide-y divide-gray-200">
                                <tr>
                                    <td className="border border-gray-300 px-6 py-3 ">{i.subject}</td>
                                    <td className="border border-gray-300 px-6 py-3 text-center">{i.from_user}</td>
                                    <td className="border border-gray-300 px-6 py-3 ">{i.detail}</td>
                                    <td className="border border-gray-300 px-6 py-3 text-center">{i.create_at}</td>
                                    {
                                        i.status == "pending" ? (
                                            <>
                                                <td className="border border-gray-300 px-6 py-3 text-center text-red-500">{i.status}</td>
                                                <td className="border border-gray-300px-6 py-2 px-6">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <form action={updatereport}>
                                                            <input type="hidden" name="report_id" value={i.id} />
                                                            <button className="px-4 py-2 rounded-md bg-green-400 text-white font-medium shadow-sm hover:bg-green-600 transition">
                                                                Confirm
                                                            </button>

                                                        </form>

                                                        <form action={deletereport}>
                                                            <input type="hidden" name="report_id" value={i.id} />
                                                            <button className="px-4 py-2 rounded-md bg-red-500 text-white font-medium shadow-sm hover:bg-red-600 transition">
                                                                Delete
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="border border-gray-300 px-6 py-3 text-center text-green-600">{i.status}</td>
                                                <td className="border border-gray-300px-6 py-2 px-6">
                                                    <div className="flex justify-center items-center gap-2">


                                                        <form action={deletereport}>
                                                            <input type="hidden" name="report_id" value={i.id} />
                                                            <button className="px-4 py-2 rounded-md bg-red-500 text-white font-medium shadow-sm hover:bg-red-600 transition">
                                                                Delete
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </>
                                        )
                                    }



                                </tr>
                            </tbody>
                        ))

                    ) : (
                        <div>
                            <h1>No Report</h1>
                        </div>
                    )

                }

            </table>
        </div>
    );
}