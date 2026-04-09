const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({});

async function main() {
  // --- Admin User ---
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@rsbhayangkara.com' },
    update: {},
    create: {
      name: 'Admin RS Bhayangkara',
      email: 'admin@rsbhayangkara.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created/verified');

  // --- Doctors ---
  const doctorsData = [
    { id: 'doc-andi', name: 'dr. Andi Prasetyo, Sp.JP', specialization: 'Poli Jantung', isAvailable: true },
    { id: 'doc-sari', name: 'dr. Sari Dewi, Sp.A', specialization: 'Poli Anak', isAvailable: true },
    { id: 'doc-ratna', name: 'dr. Ratna Wulandari, Sp.OG', specialization: 'Poli Kandungan', isAvailable: false },
    { id: 'doc-hendra', name: 'dr. Hendra Kusuma, Sp.B', specialization: 'Poli Bedah', isAvailable: true },
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.upsert({
      where: { id: doc.id },
      update: {},
      create: doc,
    });
  }
  console.log('✅ Doctors seeded');

  // --- Schedules ---
  // Create dates for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const schedulesData = [
    { doctorId: 'doc-andi', time: '08.00 – 12.00', totalQuota: 20, filledQuota: 8, date: today },
    { doctorId: 'doc-sari', time: '09.00 – 13.00', totalQuota: 20, filledQuota: 17, date: today },
    { doctorId: 'doc-ratna', time: '10.00 – 14.00', totalQuota: 20, filledQuota: 20, date: today },
    { doctorId: 'doc-hendra', time: '13.00 – 17.00', totalQuota: 15, filledQuota: 5, date: today },
  ];

  // For schedules we can just create them if none exist
  const existingSchedules = await prisma.schedule.count();
  if (existingSchedules === 0) {
    for (const sched of schedulesData) {
      await prisma.schedule.create({ data: sched });
    }
    console.log('✅ Schedules seeded');
  } else {
    console.log('ℹ️ Schedules already exist');
  }

  // --- News ---
  const newsData = [
    {
      title: 'Tips Menjaga Kesehatan Jantung di Usia Produktif',
      slug: 'tips-menjaga-kesehatan-jantung',
      excerpt: 'Penyakit jantung kini tidak hanya menyerang lansia. Simak 7 kebiasaan sehat yang dapat melindungi jantung Anda sejak dini.',
      content: 'Kesehatan jantung dipengaruhi oleh pola hidup. Kami menyarankan untuk melakukan olahraga 30 menit sehari...',
      category: 'Kesehatan',
    },
    {
      title: 'Kabar Baik: Layanan Poli Anak RS Bhayangkara Diperluas',
      slug: 'layanan-poli-anak-diperluas',
      excerpt: 'Merespons tingginya kebutuhan masyarakat, kami kini menambah 2 dokter spesialis anak dan memperluas area bermain poli.',
      content: 'Poli anak kini memiliki fasilitas bermain dan ruang periksa yang nyaman dengan penambahan jam kerja.',
      category: 'Pengumuman',
    },
    {
      title: 'Program Cek Kesehatan Gratis untuk Warga Nganjuk',
      slug: 'cek-kesehatan-gratis-maret',
      excerpt: 'Dalam rangka HUT Bhayangkara, dapatkan pemeriksaan tensi, gula darah, dan konsultasi dokter umum gratis minggu ini.',
      content: 'Silahkan datang membawa KTP asli warga Nganjuk untuk medapatkan fasilitas ini.',
      category: 'Program',
    },
  ];

  for (const n of newsData) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    });
  }
  console.log('✅ News seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
