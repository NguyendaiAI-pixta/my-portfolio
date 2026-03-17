import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  const filePath = path.join(process.cwd(), 'public/code/building-llm-applications/ch01/01-langchain_examples.ipynb');
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-ipynb+json',
        'Content-Disposition': 'attachment; filename="01-langchain_examples.ipynb"',
      },
    });
  } catch (error) {
    return new Response('File not found', { status: 404 });
  }
};
