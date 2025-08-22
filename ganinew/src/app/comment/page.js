'use client'
import { useState, useEffect } from "react"

export default function Page() {
    const [commment, setComment] = useState([])
    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await fetch('/api/comment')
                const data = await res.json()
                setComment(data)
            } catch (err) {
                console.log("Error is : ", err)
            }
        }
        fetchdata()
    }, [])
    return (
    <div>
        {commment.map((i) => <>{i.detail} {i.id} </>)}
    </div>
    )
}