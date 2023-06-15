const express = require("express");
const router = express.Router();

const { authorize }  = require("../services/authorize");
var admin = __dirname + "/../views/admin/"; // Admin folder path
var client = __dirname + "/../views/client/"; // client folder path
var error = __dirname + "/../views/error/"; // client folder path

// Global variables
const {sidebar} = require("./../views/components/sidebar");
const {topHeader} = require("./../views/components/topHeader");
const {head} = require("./../views/components/head");
const {scripts} = require("./../views/components/scripts");

/**
 * @Details
 * Client Routes 
 */

router.get("/", async (req, res) => {

    try {

        res.render(
            client + "index.html",
            {
                head: head,
                scripts: scripts,
            }
        );

    } catch (err) {
        console.log(err);
        res.render(
            error + "500.html"
        );
    }

});

router.get("/dashboard", async (req, res) => {

    try {

        res.render(
            client + "dashboard.html",
            {
                sidebar: sidebar,
                topHeader: topHeader,
                head: head,
                scripts: scripts,
            }
        );

    } catch (err) {
        console.log(err);
        res.render(
            error + "500.html"
        );
    }

});


router.get("/profile", async (req, res) => {

    try {

        res.render(
            client + "profile.html",
            {
                sidebar: sidebar,
                topHeader: topHeader,
                head: head,
                scripts: scripts,
            }
        );

    } catch (err) {
        console.log(err);
        res.render(
            error + "500.html"
        );
    }

});

/**
 * @Details
 * Admin Routes 
 */
router.get("/admin/dashboad", authorize, async (req, res) => {

    try {

        res.render(
            admin + "index.html",
            {
            }
        );

    } catch (err) {
        console.log(err);
        res.render(
            error + "500.html"
        );
    }

});

module.exports = router;