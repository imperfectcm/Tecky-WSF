import { readdir } from 'node:fs/promises';


async function listAllJsRecursive(targetPath: string) {
    try {
        const files = await readdir(targetPath);
        for (const file of files)
            console.log(targetPath + "\\" + file);
    } catch (err) {
        console.error(err);
    }
}

listAllJsRecursive("C:\\Users\\CM\\Desktop\\a");