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
            <input type="file" accept="image/*" onChange={handleUpload} />
            {filename && <p>อัปโหลดแล้ว: {filename}</p>}
        </div>
    )
}