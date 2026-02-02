
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    try {
        console.log('Verifying content...');
        const homePage = await prisma.page.findUnique({
            where: { slug: 'home' },
            include: { translations: true }
        });

        if (!homePage) {
            console.error('Home page not found!');
            return;
        }

        for (const t of homePage.translations) {
            console.log(`\nLocale: ${t.localeCode}`);
            const blocks = t.blocks as any[];
            const hero = blocks.find(b => b.type === 'hero');
            if (hero) {
                console.log(`Hero Tagline: ${hero.tagline}`);
            } else {
                console.log('Hero block not found');
            }
        }

        console.log('\nChecking Health Tourism Page...');
        const htPage = await prisma.page.findUnique({
            where: { slug: 'health-tourism' },
            include: { translations: true }
        });
        if (htPage) {
            for (const t of htPage.translations) {
                console.log(`\nLocale: ${t.localeCode}`);
                const blocks = t.blocks as any[];
                const intro = blocks.find(b => b.type === 'intro');
                if (intro) console.log(`Intro Headline: ${intro.headline}`);
            }
        } else {
            console.log("Health Tourism Page not found");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
