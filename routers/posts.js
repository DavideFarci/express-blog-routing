const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Index
router.get("/", postController.index);

// Create
router.get("/create", postController.create);

// Show (slug)
router.get("/:slug", postController.show);

// Dowload (slug)
router.get("/:slug/download-img", postController.downloadImg);

module.exports = router;
