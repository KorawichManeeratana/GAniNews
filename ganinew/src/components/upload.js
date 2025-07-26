'use client';
import { useState } from "react";

export default function ImageUpload() {
    const [filename, setFilename] = useState('');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        setFilename(file.name);

        const formData = new FormData();
        formData.append('file', file);

        await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
    };
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-indigo-50 file:text-purple-500
             hover:file:bg-indigo-100"/>
            {filename && <p>อัปโหลดแล้ว: {filename}</p>}
        </div>
    )
}