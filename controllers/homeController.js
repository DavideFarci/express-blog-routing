const fs = require("fs");
const path = require("path");

function index(req, res) {
  res.format({
    html: () => {
      // Leggo il contenuto di index.html
      let htmlContent = fs.readFileSync(
        path.resolve(__dirname, "../index.html"),
        "utf-8"
      );

      // Costruisco il corpo della home
      const body = `
      <h1 class="text-5xl mt-64 ml-2">Benvenuto nel mio Blog</h1>
      <button class="mt-12 ml-8 px-4 py-2 font-semibold bg-blue-400 rounded-md">
        <a href="/posts">Vedi i Post</a>
      </button>`;

      // Sostituisco i placeholder di index con il titolo e il corpo della home
      htmlContent = htmlContent
        .replace("@title", "Il mio Blog")
        .replace("@body", body);

      // Mando tutto al server
      res.type("html").send(htmlContent);
    },
    json: () => {
      res.type("json").send({ message: "Benvenuto nel mio blog!" });
    },
    default: () => {
      res.status(406).send("Not acceptable");
    },
  });
}

module.exports = {
  index,
};
