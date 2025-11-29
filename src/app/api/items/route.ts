// src/app/api/items/route.ts
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const runtime = "edge"; // if using Next.js 16+ App Router

export const POST = async (req: Request) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "/public/uploads");
  form.keepExtensions = true;

  return new Promise((resolve) => {
    form.parse(req, (err, fields, files) => {
      if (err) return resolve(new Response(JSON.stringify({ message: "Upload failed" }), { status: 500 }));

      const ITEMS_JSON = path.join(process.cwd(), "items.json");
      const items = fs.existsSync(ITEMS_JSON) ? JSON.parse(fs.readFileSync(ITEMS_JSON, "utf-8")) : [];

      const newItem = {
        name: fields.name,
        description: fields.description,
        price: fields.price,
        category: fields.category, // <-- store category
        image: (files.file as any).newFilename,
      };

      items.push(newItem);
      fs.writeFileSync(ITEMS_JSON, JSON.stringify(items, null, 2));

      resolve(new Response(JSON.stringify({ message: "Item uploaded successfully" })));
    });
  });
};
