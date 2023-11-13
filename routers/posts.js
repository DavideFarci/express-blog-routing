const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Index
router.get("/", postController.index);

// Show (slug)
router.get("/:id", postController.show);

// Create
router.get("/create", postController.create);

// Dowload (slug)
router.get("/:id/download-img", postController.download);

module.export = router;
