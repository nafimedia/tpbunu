const { resolve } = require('node:path');
const { randomUUID } = require('node:crypto');
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
  const links = [
    {
      label: 'Laporan AMI dan RTM',
      href: 'https://drive.google.com/drive/folders/1ttEdV-knocRn8l_Xsg5bvuDtg2Hkq9u8?usp=drive_link',
      note: 'Audit Mutu Internal & Rapat Tinjauan Manajemen',
    },
    {
      label: 'Laporan Monev PBM',
      href: 'https://drive.google.com/drive/folders/1LNN6CVJbj_7jJbd748ZvuqhuOjhFtdeE?usp=drive_link',
      note: 'Monitoring & Evaluasi Proses Belajar Mengajar',
    },
    {
      label: 'IKAD dan RTL',
      href: 'https://drive.google.com/drive/folders/1x8fHEB1DkXfIRpLyOJRID8-qWamiVREa?usp=drive_link',
      note: 'Indeks Kinerja Dosen & Rencana Tindak Lanjut',
    },
    {
      label: 'Laporan RTM Universitas',
      href: 'https://drive.google.com/drive/folders/1ad6P7puUghjXIkNVisg7QTXFQsEWCKmS?usp=drive_link',
      note: 'Rapat Tinjauan Manajemen Tingkat Universitas',
    },
    {
      label: 'Laporan Survei dan RTL',
      href: 'https://drive.google.com/drive/folders/137USiGJNiw2DiBCMXFJwZJf8N0kxfJ4R?usp=drive_link',
      note: 'Survei Kepuasan & Rencana Tindak Lanjut',
    },
    {
      label: 'Laporan IKAD FST Ganjil 2024-2025',
      href: 'https://drive.google.com/file/d/1IoZ1M9sJHpgKAttxD8Z8Aqh97U8NbUzb/view?usp=drive_link',
      note: 'Dokumen IKAD Semester Ganjil',
    },
    {
      label: 'Laporan IKAD FST Genap 2024-2025',
      href: 'https://drive.google.com/file/d/1LJy9fNCrcScm3fq32MzVqXiZpvkJj69D/view?usp=drive_link',
      note: 'Dokumen IKAD Semester Genap',
    },
  ];

  const docBlockData = {
    kicker: 'Penjaminan Mutu',
    title: 'Penjaminan Mutu',
    note: 'Laporan Audit Mutu Internal (AMI), RTM, Monev PBM, IKAD, dan Survei Kepuasan TPB UNU Purwokerto.',
    links,
  };

  // 1. Find or create page "penjaminan-mutu"
  let page = await prisma.page.findUnique({
    where: { slug: 'penjaminan-mutu' },
    include: { blocks: true },
  });

  const now = new Date();

  if (!page) {
    const pageId = randomUUID();
    const blockId = randomUUID();
    const publishedData = {
      page: {
        title: 'Penjaminan Mutu',
        slug: 'penjaminan-mutu',
        seoTitle: 'Penjaminan Mutu — Teknik Pertanian & Biosistem UNU Purwokerto',
        seoDescription: 'Dokumen dan laporan sistem penjaminan mutu internal (SPMI) Program Studi Teknik Pertanian & Biosistem UNU Purwokerto.',
        ogImage: null,
      },
      blocks: [
        {
          id: blockId,
          type: 'docLink',
          isVisible: true,
          anchor: 'penjaminanmutu',
          data: docBlockData,
        },
      ],
    };

    page = await prisma.page.create({
      data: {
        id: pageId,
        slug: 'penjaminan-mutu',
        title: 'Penjaminan Mutu',
        status: 'published',
        publishedAt: now,
        publishedData,
        blocks: {
          create: {
            id: blockId,
            type: 'docLink',
            position: 0,
            isVisible: true,
            anchor: 'penjaminanmutu',
            data: docBlockData,
          },
        },
      },
      include: { blocks: true },
    });
    console.log('✓ Halaman "penjaminan-mutu" berhasil dibuat dan diterbitkan.');
  } else {
    // Page exists, update block and publishedData
    let docBlock = page.blocks.find((b) => b.type === 'docLink');
    let blockId = docBlock ? docBlock.id : randomUUID();

    if (docBlock) {
      await prisma.block.update({
        where: { id: docBlock.id },
        data: {
          data: docBlockData,
          anchor: 'penjaminanmutu',
          isVisible: true,
        },
      });
    } else {
      docBlock = await prisma.block.create({
        data: {
          id: blockId,
          pageId: page.id,
          type: 'docLink',
          position: 0,
          isVisible: true,
          anchor: 'penjaminanmutu',
          data: docBlockData,
        },
      });
    }

    const updatedPublishedData = {
      page: {
        title: 'Penjaminan Mutu',
        slug: 'penjaminan-mutu',
        seoTitle: 'Penjaminan Mutu — Teknik Pertanian & Biosistem UNU Purwokerto',
        seoDescription: 'Dokumen dan laporan sistem penjaminan mutu internal (SPMI) Program Studi Teknik Pertanian & Biosistem UNU Purwokerto.',
        ogImage: null,
      },
      blocks: [
        {
          id: blockId,
          type: 'docLink',
          isVisible: true,
          anchor: 'penjaminanmutu',
          data: docBlockData,
        },
      ],
    };

    await prisma.page.update({
      where: { id: page.id },
      data: {
        status: 'published',
        publishedAt: page.publishedAt || now,
        publishedData: updatedPublishedData,
      },
    });
    console.log('✓ Halaman "penjaminan-mutu" dan blok dokumennya berhasil diperbarui.');
  }

  // 2. Ensure NavItem exists in navbar
  let nav = await prisma.navItem.findFirst({
    where: { label: 'Penjaminan Mutu', parentId: null },
  });

  if (!nav) {
    nav = await prisma.navItem.create({
      data: {
        label: 'Penjaminan Mutu',
        href: '/penjaminan-mutu#penjaminanmutu',
        openInNewTab: false,
        position: 3,
      },
    });
    console.log('✓ Menu "Penjaminan Mutu" berhasil ditambahkan ke navbar.');
  } else {
    await prisma.navItem.update({
      where: { id: nav.id },
      data: {
        href: '/penjaminan-mutu#penjaminanmutu',
      },
    });
    console.log('✓ Menu "Penjaminan Mutu" di navbar sudah aktif.');
  }

  // Position ordering: Beranda, Profil, Akademik, Penjaminan Mutu, Penelitian & Pengabdian, Kemahasiswaan, Berita
  const preferredLabels = [
    'Beranda',
    'Profil',
    'Akademik',
    'Penjaminan Mutu',
    'Penelitian & Pengabdian',
    'Kemahasiswaan',
    'Berita',
  ];

  const allParents = await prisma.navItem.findMany({
    where: { parentId: null },
  });

  for (const item of allParents) {
    const idx = preferredLabels.findIndex((l) => l.toLowerCase() === item.label.toLowerCase());
    if (idx !== -1) {
      await prisma.navItem.update({
        where: { id: item.id },
        data: { position: idx },
      });
    }
  }

  console.log('\n--- DAFTAR DOKUMEN PENJAMINAN MUTU ---');
  for (const item of links) {
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
