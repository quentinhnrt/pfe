import {faker} from '@faker-js/faker'
import prisma from '@/lib/prisma'
import templates from "./data/templates.json";


async function main() {
    console.log('🌱 Starting seed...')

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
        Array.from({length: 10}).map(() =>
            prisma.user.create({
                data: {
                    email: faker.internet.email(),
                    firstname: faker.person.firstName(),
                    lastname: faker.person.lastName(),
                    name: faker.internet.username(),
                    emailVerified: true,
                    role: 'ARTIST',
                    image: faker.image.personPortrait(),
                    bannerImage: faker.image.urlPicsumPhotos(),
                    bio: faker.lorem.sentence(),
                    location: faker.location.city(),
                    website: faker.internet.url(),
                    onBoarded: true,
                    createdAt: faker.date.past(),
                    updatedAt: new Date(),
                },
            })
        )
    )

    for (const user of users) {
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
                }
            )
        )

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
    }

    console.log('✅ Seed terminé avec succès.')
}

function getRandomDimensions(): { width: number; height: number } {
    const type = faker.helpers.arrayElement(['square', 'portrait', 'landscape']);

    // base size
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
