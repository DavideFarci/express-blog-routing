const fs = require("fs");
const path = require("path");

const posts = require("../db/posts.json");

function index(req, res) {
  res.format({
    html: () => {
      // leggo il contenuto di index.html
      let htmlContent = fs.readFileSync(
        path.resolve(__dirname, "../index.html"),
        "utf-8"
      );

      // Costruisco il corpo della vista dei post
      const body = `
        <div class="container mx-auto py-2">
          <h1 class="text-5xl font-bold text-center">I miei Post</h1>
          <ul class="grid grid-cols-3 gap-8 py-12">
            @post
          </ul>
        </div>
      `;

      // leggo l'html del componente singolo post
      let listContent = fs.readFileSync(
        path.resolve(__dirname, "../partials/post.html"),
        "utf-8"
      );

      // Costruisco il nuovo array con i post renderizzati
      const postsHtml = posts.map((post) =>
        // Sostituisco i placeholder(@) del componente con i valori dei post
        listContent
          .replace("@title", post.title)
          .replace("@content", post.content)
          .replace("@image", post.image)
          .replace("@tags", post.tags)
      );

      // Aggiungo i post renderizzati al corpo
      const postListHtml = body.replace("@post", postsHtml.join(""));

      // Sostituisco i placeholder con titolo e corpo
      htmlContent = htmlContent
        .replace("@title", "I miei Post")
        .replace("@body", postListHtml);
      // Mando la stringa al server (html)
      res.type("html").send(htmlContent);
    },
    json: () => {
      res.type("json").send({
        totalElements: posts.length,
        data: posts,
      });
    },
    default: () => {
      res.status(406).send("Not acceptable");
    },
  });
}

module.exports = {
  index,
};
