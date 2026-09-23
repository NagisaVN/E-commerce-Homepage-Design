const fs = require('fs/promises');
const path = require('path');

async function test(slug) {
  const dbPath = path.join(process.cwd(), "db.json");
  const dbContent = await fs.readFile(dbPath, "utf-8");
  const db = JSON.parse(dbContent);
  const cleanSlug = slug?.trim();
  const product = db.san_pham?.find((item) => item.slug?.trim() === cleanSlug);
  console.log("Found:", product?.id);
}

test("sp-mk6111-2").catch(console.error);
