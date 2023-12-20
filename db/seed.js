import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const groups = [
    {
      title: "Asura Scans",
      slug: "asurascans",
      updated_at: new Date(),
      link: "https://asuratoon.com/",
      icon: ""
    },
    {
      title: "Flame Comics",
      slug: "flamecomics",
      updated_at: new Date(),
      link: "https://flamecomics.com/",
      icon: ""
    },
    {
      title: "Rizz Comics",
      slug: "rizzcomic",
      updated_at: new Date(),
      link: "https://rizzcomic.com/",
      icon: ""
    },
    {
      title: "Drake Scans",
      slug: "drakescans",
      updated_at: new Date(),
      link: "https://drakescans.com/",
      icon: ""
    },
    {
      title: "Shinigami",
      slug: "shinigami",
      updated_at: new Date(),
      link: "https://shinigami.moe/",
      icon: ""
    }
  ];

  for (const group of groups) {
    await prisma.groups.upsert({
      where: {
        slug: group.slug
      },
      create: group,
      update: {}
    });
  }

  console.log("Groups created!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
