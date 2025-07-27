import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(){
    try {
        const res = await pool.query('SELECT * FROM users')
        return NextResponse.json(res.rows)
    } catch (err){
        console.log('Error', err)
    }
}