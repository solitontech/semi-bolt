import type { ActionFunction } from '@remix-run/node';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const action: ActionFunction = async ({ request }) => {
  try {
    const data = (await request.json()) as { directory?: string };
    const cwd = data.directory;
    if (!cwd) {
      return Response.json(
        {
          success: false,
          error: 'Directory is required',
        },
        { status: 400 },
      );
    }
    // Check if the directory exists
    try {
      await fs.promises.access(cwd);
    } catch (err) {
      return Response.json(
        {
          success: false,
          error: 'Directory does not exist',
        },
        { status: 400 },
      );
    }
    // Check if the directory is a valid npm project
    const packageJsonPath = path.join(cwd, 'package.json');
    try {
      await fs.promises.access(packageJsonPath);
    } catch (err) {
      return Response.json(
        {
          success: false,
          error: 'Directory is not a valid npm project',
        },
        { status: 400 },
      );
    }

    execSync('npm install', {
      cwd,
    });

    return Response.json({
      success: true,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
};
