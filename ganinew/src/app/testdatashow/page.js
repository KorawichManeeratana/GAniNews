"use client"
import { Header } from "/src/components/header";
import { useState, useEffect } from "react";
import Editors from "@/components/editor";
import ImageUpload from "@/components/upload";
import Link from "next/link";
import testform from "./action"
export default function Editprofile() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <form action={testform} className="grid-flow-col space-y-4">

                <label htmlFor="testdata1" className="block text-sm font-medium text-gray-700">
                    Testdata
                </label>
                <input
                    name="testdata1"
                    id="testdata1"
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter your testdata1..."
                />
                <button
                    type="submit"
                    className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
