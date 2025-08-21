'use server'
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
const prisma = new PrismaClient()
export default async function createProfile(formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const location = formData.get('location')
    const bio = formData.get('bio')
    const genresform = formData.get('genres')
    const photo = formData.get('image')
    const user_id = 1;
    let insertdata;
    let genres = []

    const checkdata = Object.fromEntries(
        Object.entries({
            name,
            location,
            bio,
            photo
        }).filter(([_, v]) => v !== undefined && v !== null && v !== "")
    )

    try {
        genres = JSON.parse(genresform);
    } catch {
        genres = [];
    }
    try {
        if (email && email.length !== 0) {
            await prisma.users.update({
                where: {
                    id: user_id,
                },
                data: {
                    email: email
                },
            })
        }
        const userInfoExists = await prisma.userInfo.findUnique({
            where: { user_id }
        });
        if (!userInfoExists) {
            insertdata = await prisma.userInfo.create({
                data: {
                    ...checkdata,
                    user_id: user_id,
                },
                select: { id: true }
            })
        } else {
            insertdata = await prisma.userInfo.update({
                where: { user_id: user_id },
                data: checkdata,
                select: { id: true }
            });
        }
        if (genres.length > 0) {
            await prisma.userGen.deleteMany({
                where: {
                    userinfo_id: insertdata.id
                },
            });
            await Promise.all(
                genres.map(genid =>
                    prisma.userGen.create({
                        data: {
                            gen_id: Number(genid),
                            userinfo_id: insertdata.id
                        }
                    })
                )
            )
        }

        return redirect('/profile');

    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }

}
