/**
 * @Description 
 * This route file has all dev routes. 
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const express        = require("express");
const {authorize}    = require("../services/authorize");
const controller     = require("../controllers/dev.controller");
const router         = express.Router();

router.post("/login",  controller.login);
router.get("/error/list", authorize,  controller.error_list);
router.get("/error/delete", authorize,  controller.error_delete);

module.exports = router;