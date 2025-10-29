"use client"
import { useState } from "react";
import ImageUpload from "@/components/upload"
import { testdata } from "./action";
export default function Uploadform() {
    return (
        <>
            <form action={testdata}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        name="title"
                        id="title"
                        className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Enter post title"
                        required />
                </div>
                <div>
                    <ImageUpload/>
                </div>
                <button type="submit">
                    submit
                </button>
            </form>

        </>
    )
}