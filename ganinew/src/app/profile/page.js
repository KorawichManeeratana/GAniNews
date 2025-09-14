'use client'
import { useState, useEffect } from 'react'

export default function profile() {
    const [userinfo, setUserinfo] = useState([])
    const [user, setUser] = useState([])
    const [gendata, setGenresdata] = useState([])

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const apiuserinfo = await fetch('/api/userinfo')
                const datauserinfo = await apiuserinfo.json()
                setUserinfo(datauserinfo)
            } catch (err) {
                console.log("Error is : ", err)
            }
        }
        fetchdata()
    }, [])

    console.log("userinfo: ", userinfo)

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center py-8">

            <div className="w-full max-w-5xl mb-6 px-4">
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
                    ← Back to Home
                </a>
            </div>



            {userinfo.map((i, index) => (
                <div key={index} className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">


                    <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center">


                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <img className='rounded-full' src={i.photo ? `${i.photo}` : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}></img>
                        </div>



                        {
                            i.name ? (
                                <h2 className="mt-4 text-lg font-semibold text-gray-900">{i.name}</h2>
                            ) : (
                                <h2 className="mt-4 text-lg font-semibold text-gray-900">{i.user.username}</h2>
                            )
                        }



                        <a href='/profile/editprofile' className="mt-2 px-4 py-2 bg-white border rounded-lg flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100">
                            ✎ Edit Profile
                        </a>

                        <div className="mt-6 w-full text-sm text-gray-600 space-y-3">
                            <p className="flex items-center gap-2">
                                📧 <span>{i.user.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                📍 <span>{i.location}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                📅 <span>{new Date(i.user.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}</span>
                            </p>
                        </div>



                        <div className="my-4 border-t w-full"></div>


                        <div className="w-full">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Favorite Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {i.usergen.map((j)=>(
                                    <span   key={j.gen_id}  className="px-3 py-1 bg-gray-100 rounded-full text-sm">{j.genre.gen_name}</span>
                                ))}
                           
                                
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-2xl shadow-sm border p-6 md:col-span-2">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">About</h3>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-normal break-words">
                            {i.bio}
                        </p>
                    </div>
                </div>
            ))}
        </div>

    )
}