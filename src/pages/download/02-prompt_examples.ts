import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    const filePath = path.join(process.cwd(), 'public/code/building-llm-applications/ch02/02-prompt_examples.ipynb');
    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/x-ipynb+json',
        'Content-Disposition': 'attachment; filename="02-prompt_examples.ipynb"',
      },
    });
  } catch (error) {
    return new Response('File not found', { status: 404 });
  }
};
