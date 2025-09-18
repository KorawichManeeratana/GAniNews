'use server'
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
const prisma = new PrismaClient()
export async function deletereport(formData) {
    const report_id = formData.get("report_id")
    try {
        await prisma.reports.delete({
            where: { id: Number(report_id) }
        })
    } catch (err) {
        console.log("Error : ", err)
    }
    redirect("/admin")
}
export async function updatereport(formData) {
    const report_id = formData.get("report_id")
    try {
        await prisma.reports.update({
            where: { id: Number(report_id) },
            data:{
                status : "success"
            }
        })
    } catch (err) {
        console.log("Error : ", err)
    }
    redirect("/admin")
}