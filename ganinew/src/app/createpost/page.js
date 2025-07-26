"use client";
import { Header } from "/src/components/header";
import { useState } from "react";
import Editors from "@/components/editor";
import ImageUpload from "@/components/upload";
export const createpost = () => {
    return (
        <div>
            {/* <Header /> */}
            <h1>Back to homepage</h1>
            <form className="flex flex-col">

                <label htmlFor="title">Title</label>
                <input name="title" id="title"/>
                <label htmlFor="category">Category</label>
                <select>
                    <option>Game</option>
                    <option>Anime</option>
                </select>
                <Editors />
                <label htmlFor="genres">Genres</label>
                <div>
                    <button>Action</button>
                    <button>Adventure</button>
                    <button>RPG</button>
                    <button>Fantsy</button>
                    <button>Sci-Fi</button>
                    <button>Romance</button>
                    <button>Drama</button>
                    <button>Comedy</button>
                    <button>Horror</button>
                    <button>Mystery</button>
                </div>
                <label htmlFor="thumbnail">Thumbnail Image</label>
                <ImageUpload />
            </form>
        </div>
    );
};

export default createpost;
