const { resolve } = require('node:path');
const { loadEnvFile } = require('node:process');

try {
  loadEnvFile(resolve(__dirname, '../apps/api/.env'));
} catch {}

const prismaPath = resolve(__dirname, '../apps/api/node_modules/@prisma/client');
const { PrismaClient } = require(prismaPath);
const prisma = new PrismaClient();

async function run() {
  await prisma.block.updateMany({ where: { type: 'stats' }, data: { isVisible: false } });
  const page = await prisma.page.findUnique({ where: { slug: 'beranda' } });
  if (page && page.publishedData && Array.isArray(page.publishedData.blocks)) {
    page.publishedData.blocks = page.publishedData.blocks.map((b) => (b.type === 'stats' ? { ...b, isVisible: false } : b));
    await prisma.page.update({ where: { slug: 'beranda' }, data: { publishedData: page.publishedData } });
  }
  console.log('Sukses: Section statistik (1200+ Mahasiswa) berhasil disembunyikan dari landing page!');
  await prisma.$disconnect();
}

run().catch(console.error);
