'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation"
export default async function testform(formData) {
    const testdata1 = formData.get('testdata1')
    const user_id = 1;
    // const checkdata = Object.fromEntries(
    //     Object.entries({
    //         ctest: testdata1
            
    //     }).filter(([_, v]) => v !== undefined && v !== null && v !== "")
    // )
    
    try {
    
        
        const userinfogendata = await prisma.userGen.findMany({
            where: {
                userinfo_id: 1
            }
        })
        if (userinfogendata.length === 0) {
            console.log("❌ ไม่พบข้อมูล");
        } else {
            console.log("✅ เจอข้อมูล:", userinfogendata);
        }
        return 1;
    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }

}
