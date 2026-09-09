const express = require("express");
const router = express.Router();

const { getByCategory } = require("../controllers/recommendatioController");

router.post("/", getByCategory);

module.exports = router;
