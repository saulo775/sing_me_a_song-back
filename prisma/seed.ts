import { prisma } from "../src/database.js";

async function main() {
    await prisma.recommendation.upsert({
        where: { name: 'fun cats' },
        update: {},
        create: {
            name: 'fun cats',
            youtubeLink: 'http://youtube.com/fun-cats'
        }
    });
}

main().catch((e) => {
    console.log(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})