/**
 * @Description 
 * This route file has all user routes. 
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const express        = require("express");
const {authorize}    = require("../services/authorize");
const controller     = require("../controllers/user.controller");
const router         = express.Router();

router.post("/login",  controller.login);
router.post("/add", authorize,  controller.add);
router.get("/check", authorize,  controller.check);
router.get("/logout", authorize,  controller.logout);
router.post("/list", authorize,  controller.list);
router.post("/view", authorize,  controller.view);
router.post("/edit", authorize,  controller.edit);

module.exports = router;