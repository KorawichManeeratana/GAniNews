'use client';
import { useState } from "react";
import imageCompression from 'browser-image-compression';

export default function ImageUpload() {
    const [fileobject, setFileobject] = useState('');
    const [imgmem, setImgmem] = useState(null);
    const [filename, setFilename] = useState("");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            // compress → Blob
            const compressedBlob = await imageCompression(file, options);

            // แปลง Blob → File
            const compressedFile = new File([compressedBlob], file.name, { type: file.type });

            // ใส่ compressedFile กลับไปใน input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(compressedFile);
            e.target.files = dataTransfer.files;

            // preview
            if (imgmem) URL.revokeObjectURL(imgmem);
            const previewimg = URL.createObjectURL(compressedFile);

            setImgmem(previewimg);
            setFileobject(compressedFile);
            setFilename(compressedFile.name);
        } catch (err) {
            console.error("Compression error:", err);
        }
    };



    const handleCancel = () => {
        if (imgmem) {
            URL.revokeObjectURL(imgmem);
        }
        setFileobject("");
        setImgmem(null);
        setFilename("");

        const input = document.getElementById('file');
        if (input) input.value = "";
        console.log("Memory cleared & preview reset");
    };

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor="file"
                className="inline-block px-4 py-2 text-center
           rounded-md border border-gray-300 
           bg-purple-500 text-white text-sm font-medium
           cursor-pointer max-w-[130px] h-[45px]
           hover:bg-purple-600
           focus-within:ring-2 focus-within:ring-purple-500"
            >
                Choose Image
            </label>

            <input
                id="file"
                name='file'
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
            />

            {fileobject ? (
                <div className="flex flex-col items-center justify-center w-[700px] h-[300px] border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-400 gap-4">
                    <img alt="preview" src={imgmem} className="max-w-[350px] max-h-[250px] rounded-md" />
                    <div className="flex flex-row gap-4">
                        <p>Uploaded: {filename}</p>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-red-500 hover:underline text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-[700px] h-[300px] border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-400">
                    <p>Preview will appear here</p>
                </div>
            )}
        </div>
    );
}
