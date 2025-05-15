const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const favoritesController = require('../controllers/fav.js');

const { isLoggedIn } = require("../middleware.js");

router.post('/favorites/:id', isLoggedIn, wrapAsync(favoritesController.addtofav));

router.delete("/favorites/:id", isLoggedIn, wrapAsync(favoritesController.delfromfav));

router.get("/favorites", isLoggedIn, wrapAsync(favoritesController.getFavorites));

module.exports = router;
