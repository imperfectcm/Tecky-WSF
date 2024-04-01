import { readdir } from 'node:fs/promises';

async function listAllJs(targetPath: string)  {

    try {
        const files = await readdir(targetPath);
        for (const file of files)
        if (file.substr(file.length-3) == ".js"){
          console.log(targetPath + "\\" + file);
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