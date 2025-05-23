import {faker, SexType} from '@faker-js/faker'
import prisma from '@/lib/prisma'
import templates from "./data/templates.json";

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Importer les templates
    for (const template of templates) {
        await prisma.template.create({
            data: {
                name: template.name,
                slug: template.slug,
                description: template.description,
            },
        })
    }

    console.log(`📦 ${templates.length} templates importés.`)

    // 2. Créer des utilisateurs
    const users = await Promise.all(
        Array.from({length: 10}).map(() => {
                const gender: SexType = Math.random() > 0.5 ? "male" : "female";
                const firstName = faker.person.firstName(gender)
                const lastName = faker.person.lastName(gender)
                return prisma.user.create({
                    data: {
                        email: faker.internet.email({lastName, firstName}).toLowerCase(),
                        firstname: firstName,
                        lastname: lastName,
                        name: faker.internet.username({firstName, lastName}).toLowerCase(),
                        emailVerified: true,
                        role: 'ARTIST',
                        image: faker.image.personPortrait({sex: gender}),
                        bannerImage: faker.image.urlPicsumPhotos({grayscale: false, blur: 0, width: 1920, height: 500}),
                        bio: faker.lorem.sentence(),
                        location: faker.location.city(),
                        website: faker.internet.url(),
                        onBoarded: true,
                        createdAt: faker.date.past(),
                        updatedAt: new Date(),
                    },
                })
            }
        )
    )

    console.log(`👤 ${users.length} utilisateurs créés.`)

    console.log('Création des ressources par utilisateurs...')
    for (const user of users) {
        // 3. Créer des artworks
        const artworks = await Promise.all(
            Array.from({length: 20}).map(() => {
                const {width, height} = getRandomDimensions();
                return prisma.artwork.create({
                    data: {
                        userId: user.id,
                        title: faker.lorem.words(3),
                        description: faker.lorem.paragraph(),
                        isForSale: faker.datatype.boolean(),
                        price: faker.number.int({min: 10, max: 500}),
                        sold: faker.datatype.boolean(),
                        thumbnail: faker.image.urlPicsumPhotos({width, height, grayscale: false, blur: 0}),
                    },
                })
            })
        )

        // 4. Créer des collections
        for (let i = 0; i < 5; i++) {
            const shuffled = faker.helpers.shuffle(artworks)
            const selected = shuffled.slice(0, 5)

            await prisma.collection.create({
                data: {
                    userId: user.id,
                    title: faker.lorem.words(2),
                    description: faker.lorem.sentences(2),
                    artworks: {
                        connect: selected.map((a) => ({id: a.id})),
                    },
                },
            })
        }

        // 5. Créer des posts avec questions
        for (let i = 0; i < 3; i++) {
            const post = await prisma.post.create({
                data: {
                    userId: user.id,
                    content: faker.lorem.paragraph(),
                    createdAt: faker.date.recent(),
                }
            })

            const question = await prisma.question.create({
                data: {
                    question: faker.lorem.sentence(),
                    postId: post.id,
                }
            })
            // Réponses proposées par l'auteur du post
            const answerCount = faker.number.int({ min: 2, max: 4 })

            for (let j = 0; j < answerCount; j++) {
                // Sélectionner des utilisateurs qui vont voter (sauf l’auteur du post)
                const voters = faker.helpers.arrayElements(
                    users.filter(u => u.id !== user.id),
                    faker.number.int({ min: 2, max: 6 })
                )

                await prisma.answer.create({
                    data: {
                        content: faker.lorem.sentence(),
                        questionId: question.id,
                        votes: voters.length,
                        users: {
                            connect: voters.map(v => ({ id: v.id })),
                        },
                    }
                })
            }
        }
    }

    // 6. Follows aléatoires entre utilisateurs
    console.log('Création des follows aléatoires entre utilisateurs...')
    for (const follower of users) {
        const followed = faker.helpers.arrayElements(
            users.filter(u => u.id !== follower.id),
            faker.number.int({min: 2, max: 5})
        )

        for (const following of followed) {
            await prisma.follow.create({
                data: {
                    followerId: follower.id,
                    followingId: following.id,
                },
            })
        }
    }

    console.log('✅ Seed terminé avec succès.')
}

function getRandomDimensions(): { width: number; height: number } {
    const type = faker.helpers.arrayElement(['square', 'portrait', 'landscape']);
    const base = faker.number.int({min: 300, max: 800});
    let width = base;
    let height = base;
    const ratio = faker.number.float({min: 1.2, max: 1.8});

    if (type === 'portrait') {
        height = Math.round(base * ratio);
    } else if (type === 'landscape') {
        width = Math.round(base * ratio);
    }

    return {width, height};
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
