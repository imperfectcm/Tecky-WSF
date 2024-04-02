import { readdir } from 'node:fs/promises';
import path from 'path';
import fs from 'fs';

async function listAllJs(targetPath: string) {

  try {
    const files = await readdir(targetPath);
    for (const file of files) {
      const fullPath = path.join(targetPath, file)
      const fileExtension = path.extname(fullPath)
      if (fileExtension == ".js") {
        console.log(fullPath);
      } else if (fs.lstatSync(fullPath).isDirectory()) {
        await listAllJs(fullPath)
      }
    }
  } catch (err) {
    console.error(err);
  }

}

listAllJs("C:\\Tecky");
