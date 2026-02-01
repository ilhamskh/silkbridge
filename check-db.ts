
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const pageCount = await prisma.page.count();
    const localeCount = await prisma.locale.count();
    console.log(`Pages: ${pageCount}`);
    console.log(`Locales: ${localeCount}`);
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
