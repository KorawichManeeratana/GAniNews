'use server'
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
const prisma = new PrismaClient()
export default async function createProfile(formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const location = formData.get('location')
    const bio = formData.get('bio')
    const genresform = formData.get('genres')
    const photo = formData.get('image')
    let genres = [];
    try {
        genres = JSON.parse(genresform);
    } catch {
        genres = [];
    }
    try {
        const insertdata = await prisma.userinfo.create({
            data: {
                bio: bio,
                location: location,
                photo: photo,
                user_id: 1,
                name: name
            },
            select: {
                id: true
            }
        })
        await prisma.users.update({
            where: {
                id: 1,
            },
            data: {
                email: email
            },
        })
        const userinfogendata = await prisma.userGen.findMany({
            where: {
                userinfo_id: insertdata.id
            }
        })
        if (userinfogendata.length !== 0) {
            console.log("carefull..")
            await prisma.usergen.deleteMany({
                where: {
                    userinfo_id: insertdata.id
                },
            });
        }
        if (genres.length > 0) {
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
        return insertdata;

    } catch (err) {
        if (err.digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        console.error(err);
        throw new Error("Someting Wrong!");
    }

}
