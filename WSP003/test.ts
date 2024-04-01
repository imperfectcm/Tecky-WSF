import fs from "fs";

async function readFile() {
  try {
    const data = await fs.promises.readFile("quotes.txt");
    const data2 = await fs.promises.readFile("package.json");
    console.log(data.toString());
    console.log(data2.toString());
  } catch (err) {
    console.log(err)
  }
  console.log("abcd")
}

readFile();


async function writeFile() {
  const dijkstraQuote1 =
    "Computer science is no more about computers than astronomy is about telescopes.\n";
  const dijkstraQuote2 = "Simplicity is prerequisite for reliability.\n";

  try {
    await fs.promises.writeFile("quotes-dijkstra.txt", dijkstraQuote1, {
      flag: "a+",
    });
    await fs.promises.writeFile("quotes-dijkstra.txt", dijkstraQuote2, {
      flag: "a+",
    });
  } catch (err) {
    console.log(err);
  }
}

writeFile();

// fs.promises.writeFile("quotes-dijkstra.txt", "Simplicity is prerequisite for reliability.\n", {flag:"a+"})
// .then (function () {
//   return 12345;
// })
// .then (function (num) {
//   console.log(num)
// })