const fs = require("fs");
const path = require("path");

const posts = require("../db/posts.js");

// INDEX ----------------------------------------------
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
          .replace("@image", post.image)
          .replace("@content", post.content)
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

// SHOW ----------------------------------------------
function show(req, res) {
  //   res.json(post);
  res.format({
    html: () => {
      const post = findOrFail(req, res);

      post.image_url = `http://localhost:${
        process.env.PORT || 3000
      }/imgs/posts/${post.image}`;

      post.image_download_url = `http://localhost:${
        process.env.PORT || 3000
      }/posts/${post.slug}/download-img`;
      let htmlContent = fs.readFileSync(
        path.resolve(__dirname, "../index.html"),
        "utf-8"
      );

      const showPost = `
        <div class="container mx-auto">
            <h1 class="text-3xl text-center">${post.title}</h1>
            <img class="mx-auto my-4" src="/imgs/posts/${post.image}" alt="img">
            <p>${post.content}</p>
            <p class="text-sm py-4"><span class="text-xl font-bold mr-4">Tags:</span>${post.tags}</p>
            <div class="text-center mt-8">
                <button class="py-2 px-4 mr-8 bg-blue-500 rounded-md ">
                    <a href="${post.image_url}">Visualizza immagine</a>
                </button>
                <button class="py-2 px-4 bg-blue-500 rounded-md ">
                    <a href="${post.image_download_url}">Scarica immagine</a>
                </button>
            </div>
        </div>
      `;
      htmlContent = htmlContent
        .replace("@title", "Post")
        .replace("@body", showPost);

      res.type("html").send(htmlContent);
    },
  });
}

// CREATE ----------------------------------------------
function create(req, res) {
  res.format({
    html: () => {
      let htmlContent = fs.readFileSync(
        path.resolve(__dirname, "../index.html"),
        "utf-8"
      );

      htmlContent = htmlContent
        .replace("@title", "Create Post")
        .replace(
          "@body",
          `<h1 class="text-center text-5xl mt-24">Creazione nuovo post</h1>`
        );

      res.type("html").send(htmlContent);
    },
    default: () => {
      res.status(406).send("Not acceptable");
    },
  });
}

// DOWNLOAD ----------------------------------------------
function downloadImg(req, res) {
  const post = findOrFail(req, res);

  const filePath = `./public/imgs/posts/${post.image}`;

  res.download(filePath);
}

function findOrFail(req, res) {
  // recupero l'id dalla richiesta
  const postSlug = req.params.slug;

  // recupero la pizza dal menu
  const post = posts.find((post) => post.slug == postSlug);

  // Nel caso in cui non sia stata trovata la pizza ritorno un 404
  if (!post) {
    res.status(404).send(`Post ${postSlug} non trovato`);
    return; // interrompo l'esecuzione della funzione
  }

  return post;
}

module.exports = {
  index,
  show,
  create,
  downloadImg,
};
