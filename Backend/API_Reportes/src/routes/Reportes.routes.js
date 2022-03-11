const { Router } = require("express");
const router = Router();
const {
  getData,
  getRam,
  getLog,
} = require("../controllers/Reportes.controller");

router.get("/CPU", getData);
router.get("/RAM", getRam);
router.get("/LOG", getLog);

module.exports = {
    routes: router,
};