const { resolve } = require('node:path');
const { loadEnvFile } = require('node:process');

try {
  loadEnvFile(resolve(__dirname, '../apps/api/.env'));
} catch {}

const prismaPath = resolve(__dirname, '../apps/api/node_modules/@prisma/client');
const { PrismaClient } = require(prismaPath);
const prisma = new PrismaClient();

async function run() {
  // 1. Delete Galeri menu item (and any children)
  const galeri = await prisma.navItem.findFirst({ where: { label: 'Galeri' } });
  if (galeri) {
    await prisma.navItem.deleteMany({ where: { parentId: galeri.id } });
    await prisma.navItem.delete({ where: { id: galeri.id } });
    console.log('✓ Menu Galeri berhasil dihapus');
  }

  // 2. Find Penelitian and Pengabdian
  const penelitian = await prisma.navItem.findFirst({
    where: { label: 'Penelitian', parentId: null },
    include: { children: true }
  });
  const pengabdian = await prisma.navItem.findFirst({
    where: { label: 'Pengabdian', parentId: null },
    include: { children: true }
  });

  if (penelitian) {
    // Rename Penelitian to "Penelitian & Pengabdian"
    await prisma.navItem.update({
      where: { id: penelitian.id },
      data: {
        label: 'Penelitian & Pengabdian',
        href: '/penelitian'
      }
    });

    // Move children from Pengabdian to Penelitian
    if (pengabdian) {
      for (const child of pengabdian.children) {
        await prisma.navItem.update({
          where: { id: child.id },
          data: {
            parentId: penelitian.id
          }
        });
      }
      // Delete old Pengabdian parent
      await prisma.navItem.delete({ where: { id: pengabdian.id } });
      console.log('✓ Menu Penelitian dan Pengabdian berhasil disatukan menjadi "Penelitian & Pengabdian"');
    }
  }

  // Position re-ordering for parents
  const allParents = await prisma.navItem.findMany({
    where: { parentId: null },
    orderBy: { position: 'asc' }
  });

  for (let i = 0; i < allParents.length; i++) {
    await prisma.navItem.update({
      where: { id: allParents[i].id },
      data: { position: i }
    });
  }

  // Re-order children of Penelitian & Pengabdian neatly
  const mergedParent = await prisma.navItem.findFirst({
    where: { label: 'Penelitian & Pengabdian', parentId: null },
    include: { children: true }
  });

  if (mergedParent) {
    const desiredOrder = [
      'Jurnal',
      'Publikasi',
      'Kolaborasi',
      'Program Desa',
      'Kegiatan',
      'Kemitraan'
    ];
    for (let i = 0; i < desiredOrder.length; i++) {
      const child = mergedParent.children.find(c => c.label.toLowerCase() === desiredOrder[i].toLowerCase());
      if (child) {
        await prisma.navItem.update({
          where: { id: child.id },
          data: { position: i }
        });
      }
    }
  }

  console.log('--- DAFTAR MENU NAVBAR TERBARU ---');
  const updatedParents = await prisma.navItem.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { position: 'asc' }
      }
    },
    orderBy: { position: 'asc' }
  });

  for (const p of updatedParents) {
    console.log(`- [${p.label}] -> ${p.href} (${p.children.length} submenu)`);
    for (const c of p.children) {
      console.log(`    • ${c.label} -> ${c.href}`);
    }
  }

  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
