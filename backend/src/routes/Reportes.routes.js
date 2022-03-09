const { Router } = require("express");
const router = Router();
const {
  getData,
  getRam,
} = require("../controllers/Reportes.controller");

router.get("/CPU", getData);
router.get("/RAM", getRam);

module.exports = {
    routes: router,
};