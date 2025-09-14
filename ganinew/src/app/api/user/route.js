import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function GET(){
    const user = await prisma.users.findUnique({
        where : {
            id : 1
        }
    })
    return Response.json(user)
}