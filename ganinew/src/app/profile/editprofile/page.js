"use client"
import { Header } from "/src/components/header";
import { useState } from "react";
import Editors from "@/components/editor";
import ImageUpload from "@/components/upload";
import Link from "next/link";

export default function Editprofile() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6">

        <Link href="/homepage" className="inline-block min-w-[200px] text-center rounded-md px-4 py-2 font-semibold hover:bg-purple-500 hover:text-white transition">← Back to HomePage</Link>

      </div>
      <div>
        <div className="flex items-center justify-center mb-10">
          <h1 className="text-2xl font-bold text-purple-500">
            Edit Your Profile
          </h1>
        </div>
        <form className="grid-flow-col space-y-4">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
            <h1>Image Preview</h1>
            <button
              type="submit"
              className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition"
            >
              Upload Image
            </button>
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              id="username"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="new username here.."
            />
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              id="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your password"
            />
            <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="newpassword"
              id="newpassword"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your password"
            />
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              id="email"
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="mt-6 w-full bg-purple-500 text-white py-2 px-4 rounded-md shadow hover:bg-purple-400 transition"
            >
              Save
            </button>
          </div>
          <div>

          </div>
        </form>
      </div>
    </div>
  );
}
