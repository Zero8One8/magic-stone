import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const importJson = path.join(root, "content-import", "chakras-pack.json");
const importImagesDir = path.join(root, "content-import", "images");
const chakraAssetsDir = path.join(root, "src", "assets", "chakras");
const targetDataFile = path.join(root, "src", "data", "chakraArticles.ts");
const targetSectionFile = path.join(root, "src", "data", "chakraSectionContent.ts");

function sanitizeText(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$")
    .trim();
}

function toArray(value) {
  if (Array.isArray(value)) return value.map((v) => sanitizeText(v));
  return [];
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyImage(imageFile, slug) {
  const src = path.join(importImagesDir, imageFile);
  const ext = path.extname(imageFile).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    throw new Error(`Unsupported image extension for ${imageFile}`);
  }
  const targetName = `${slug}${ext}`;
  const dst = path.join(chakraAssetsDir, targetName);
  await fs.copyFile(src, dst);
  return targetName;
}

async function main() {
  try {
    await fs.access(importJson);
  } catch {
    throw new Error(
      [
        "Не найден файл content-import/chakras-pack.json.",
        "Сделайте 3 шага:",
        "1) Скопируйте content-import/chakras-pack.template.json в content-import/chakras-pack.json",
        "2) Заполните тексты в chakras-pack.json",
        "3) Положите 7 фото в content-import/images",
      ].join("\n")
    );
  }

  const raw = await fs.readFile(importJson, "utf8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data.chakras) || data.chakras.length !== 7) {
    throw new Error("chakras-pack.json must contain exactly 7 items in 'chakras'");
  }

  await ensureDir(chakraAssetsDir);

  const imports = [];
  const records = [];

  for (const item of data.chakras) {
    const slug = sanitizeText(item.slug).toLowerCase();
    if (!slug) throw new Error("Each chakra must have a slug");
    if (!item.imageFile) throw new Error(`Missing imageFile for ${slug}`);

    const imageName = await copyImage(item.imageFile, slug);
    const varName = `${slug.replace(/[^a-z0-9]/g, "") || "chakra"}Img`;

    imports.push(`import ${varName} from \"@/assets/chakras/${imageName}\";`);

    const practices = toArray(item.practices);
    const stones = toArray(item.stones);

    records.push(`  {
    slug: "${slug}",
    number: "${sanitizeText(item.number)}",
    name: "${sanitizeText(item.name)}",
    sanskrit: "${sanitizeText(item.sanskrit)}",
    location: "${sanitizeText(item.location)}",
    color: "${sanitizeText(item.color)}",
    element: "${sanitizeText(item.element)}",
    image: ${varName},
    intro: "${sanitizeText(item.intro)}",
    signs: "${sanitizeText(item.signs)}",
    practices: [${practices.map((v) => `"${v}"`).join(", ")}],
    stones: [${stones.map((v) => `"${v}"`).join(", ")}],
  }`);
  }

  const file = `${imports.join("\n")}

export type ChakraArticle = {
  slug: string;
  number: string;
  name: string;
  sanskrit: string;
  location: string;
  color: string;
  element: string;
  image: string;
  intro: string;
  signs: string;
  practices: string[];
  stones: string[];
};

export const chakraArticles: ChakraArticle[] = [
${records.join(",\n")}
];

export const chakraBySlug = (slug: string) =>
  chakraArticles.find((chakra) => chakra.slug === slug);
`;

  const sectionIntro = sanitizeText(
    data.sectionIntro ||
      "Диагностика охватывает все семь чакр. Каждый центр отвечает за определённую сферу жизни — физическую, эмоциональную и духовную."
  );
  const sectionTeaser = sanitizeText(
    data.sectionTeaser ||
      "Внизу каждой чакры есть переход в отдельную статью. Там будет полный разбор: признаки дисбаланса, практики, камни и рекомендации мастера."
  );
  const sectionLinkLabel = sanitizeText(
    data.sectionLinkLabel ||
      "Общий гид по чакрам - подробнее"
  );

  const sectionFile = `export const chakraSectionContent = {
  intro: "${sectionIntro}",
  teaser: "${sectionTeaser}",
  linkLabel: "${sectionLinkLabel}",
};
`;

  await fs.writeFile(targetDataFile, file, "utf8");
  await fs.writeFile(targetSectionFile, sectionFile, "utf8");
  console.log("Chakra pack imported successfully.");
  console.log(`Updated: ${path.relative(root, targetDataFile)}`);
  console.log(`Updated: ${path.relative(root, targetSectionFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
