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
      }
    }
  } catch (err) {
    console.error(err);
  }

}

listAllJs("C:\\Users\\CM\\Desktop\\a");

/* 
It should print something like:

C:\Users\alex\Documents\tecky-exercises\main.js
C:\Users\alex\Documents\tecky-exercises\001.js
...

*/