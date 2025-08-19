'use client';
import { useState } from "react";

export default function ImageUpload({ onUpload }) {
    const [filename, setFilename] = useState('');
    const [fileLink, setFileLink] = useState('');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFilename(file.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.link) {
                setFileLink(data.link);
                onUpload && onUpload(data.link);
            }
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    const handleCancel = async () => {
        if (fileLink) {

            try {
                await fetch('/api/delete-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ link: fileLink }),
                });
            } catch (err) {
                console.error("Delete error:", err);
            }
        }

        setFilename('');
        setFileLink('');
        onUpload && onUpload(null); 
    };
    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-purple-500
                    hover:file:bg-indigo-100"
            />
            {filename && (
                <div className="flex items-center gap-4">
                    <p>อัปโหลดแล้ว: {filename}</p>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-red-500 hover:underline text-sm"
                    >
                        ยกเลิก
                    </button>
                </div>
            )}
        </div>
    );
}
