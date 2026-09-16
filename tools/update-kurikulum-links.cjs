const { resolve } = require('node:path');
const { loadEnvFile } = require('node:process');

try {
  loadEnvFile(resolve(__dirname, '../apps/api/.env'));
} catch {
  // ignore
}

const prismaPath = resolve(__dirname, '../apps/api/node_modules/@prisma/client');
const { PrismaClient } = require(prismaPath);
const prisma = new PrismaClient();

async function run() {
  const page = await prisma.page.findUnique({
    where: { slug: 'akademik' },
    include: { blocks: true },
  });

  if (!page) {
    console.error('Halaman "akademik" tidak ditemukan!');
    process.exit(1);
  }

  const newLinks = [
    {
      label: 'Dokumen & Folder Kurikulum TPB',
      href: 'https://drive.google.com/drive/folders/1o9a9tV0L7iQYt4Dv4V0oO3B2TtipIeET?usp=drive_link',
      note: 'Folder Google Drive Kurikulum',
    },
    {
      label: 'SK dan Dokumen Kurikulum TPB 2022-2027',
      href: 'https://drive.google.com/file/d/1BHGrUHDdUEnAROqkmeCaRhtE_dlGCbdd/view?usp=drive_link',
      note: 'SK Resmi Dokumen Kurikulum',
    },
    {
      label: 'Buku Pedoman FST 2026-2027',
      href: 'https://drive.google.com/file/d/1N773FfKuB_-3ci3frG29nuSHuRqJbDRX/view?usp=drive_link',
      note: 'Buku Pedoman Fakultas Sains & Teknologi',
    },
    {
      label: 'RPS Basic Science',
      href: 'https://drive.google.com/drive/folders/1lcoFjjfh4R7q-ky5P_GTh66I1DvYsIU5?usp=drive_link',
      note: 'Rencana Pembelajaran Semester (RPS)',
    },
    {
      label: 'Pedoman Capstone Design',
      href: 'https://drive.google.com/drive/folders/1lcoFjjfh4R7q-ky5P_GTh66I1DvYsIU5?usp=drive_link',
      note: 'Buku Pedoman Capstone Design',
    },
    {
      label: 'Bukti Pelaksanaan Capstone Design',
      href: 'https://drive.google.com/drive/folders/1oQLVkAEZU_AiPT8jS3fEuELJxXN6PQMT?usp=drive_link',
      note: 'Dokumentasi & Bukti Kegiatan Capstone Design',
    },
  ];

  // 1. Update Block table
  const docBlock = page.blocks.find((b) => b.type === 'docLink');
  if (docBlock) {
    const updatedData = {
      ...(typeof docBlock.data === 'object' && docBlock.data !== null ? docBlock.data : {}),
      links: newLinks,
    };
    await prisma.block.update({
      where: { id: docBlock.id },
      data: { data: updatedData },
    });
    console.log(`✓ Blok docLink (ID: ${docBlock.id}) di tabel blocks berhasil diperbarui.`);
  } else {
    console.warn('Peringatan: Blok tipe "docLink" tidak ditemukan pada tabel blocks.');
  }

  // 2. Update Page.publishedData
  if (page.publishedData && Array.isArray(page.publishedData.blocks)) {
    const updatedBlocks = page.publishedData.blocks.map((b) => {
      if (b.type === 'docLink') {
        return {
          ...b,
          data: {
            ...(typeof b.data === 'object' && b.data !== null ? b.data : {}),
            links: newLinks,
          },
        };
      }
      return b;
    });

    await prisma.page.update({
      where: { slug: 'akademik' },
      data: {
        publishedData: {
          ...page.publishedData,
          blocks: updatedBlocks,
        },
      },
    });
    console.log('✓ Page.publishedData untuk "akademik" berhasil diperbarui dengan tautan baru.');
  }

  console.log('\n--- DAFTAR DOKUMEN KURIKULUM TERBARU ---');
  for (const item of newLinks) {
    console.log(`- ${item.label}`);
    console.log(`  URL : ${item.href}`);
    console.log(`  Ket : ${item.note}`);
  }

  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
