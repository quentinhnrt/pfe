import {$Enums, PrismaClient} from '@prisma/client'
import users from './seedData/users.json'
import artworks from './seedData/artworks.json'
import posts from './seedData/posts.json'
import answers from './seedData/answers.json'
import templates from './seedData/templates.json'
import Role = $Enums.Role;

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding users...")
    for (const user of users) {
        await prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                emailVerified: user.emailVerified,
                firstname: user.firstname,
                lastname: user.lastname,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role as Role,
                onBoarded: user.onBoarded,
            }
        })
    }

    for (const artwork of artworks) {
        await prisma.artwork.create({
            data: {
                title: artwork.title,
                description: artwork.description,
                thumbnail: artwork.thumbnail,
                isForSale: artwork.isForSale,
                price: artwork.price,
                createdAt: artwork.createdAt,
                updatedAt: artwork.updatedAt,
                user: {
                    connect: {
                        id: artwork.userId,
                    }
                }
            }
        })
    }

    for (const post of posts) {
        await prisma.post.create({
            data: {
                content: post.content,
                artworks: {
                    connect: post.artworks.map((artwork: {id: number}) => {
                        return {
                            id: artwork.id,
                        }
                    }) || []
                },
                user: {
                    connect: {
                        id: post.userId,
                    }
                },
                question: {
                    connectOrCreate: {
                        where: {
                            id: post.question.id,
                        },
                        create: {
                            question: post.question.question,
                            id: post.question.id,
                        }
                    }
                }
            }
        })
    }

    for (const answer of answers) {
        await prisma.answer.create({
            data: {
                content: answer.content,
                questionId: answer.questionId,
            }
        })
    }

    for (const template of templates) {
        await prisma.template.create({
            data: {
                id: template.id,
                name: template.name,
                description: template.description,
                slug: template.slug,
            }
        })
    }

    console.log("✅ Seeding done!")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("❌ Error while seeding:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
