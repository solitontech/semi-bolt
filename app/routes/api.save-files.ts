import type { ActionFunction } from '@remix-run/node';
import fs from 'fs/promises';
import path from 'path';
import { extractRelativePath } from '~/utils/diff';

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = (await request.json()) as {
      files: Record<string, { content: string | ArrayBuffer; isBinary: boolean; type: string }>;
      fileDir: string;
    };

    const files = formData.files;
    const baseDir = formData.fileDir;

    await fs.mkdir(baseDir, { recursive: true });

    const savedFiles: string[] = [];

    for (const [filePath, dirent] of Object.entries(files)) {
      if (dirent?.type === 'file') {
        const relativePath = extractRelativePath(filePath);
        const fullPath = path.join(baseDir, relativePath);
        const dir = path.dirname(fullPath);

        await fs.mkdir(dir, { recursive: true });
        let buffer: Buffer;
        if (dirent.isBinary) {
          buffer =
            dirent.content instanceof ArrayBuffer
              ? Buffer.from(new Uint8Array(dirent.content))
              : Buffer.from(dirent.content);
        } else {
          buffer = Buffer.from(String(dirent.content));
        }

        await fs.writeFile(fullPath, buffer);
        savedFiles.push(filePath);
      }
    }

    return Response.json({ success: true, savedFiles });
  } catch (err: unknown) {
    console.error('Error saving files:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return Response.json({ success: false, error: errorMessage }, { status: 500 });
  }
};
