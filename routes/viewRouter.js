const router = require("express").Router();

const {
    renderHomePage,
    renderLoginPage
} = require("../controllers/viewController");

router.get("/", renderHomePage);

router.get("/login", renderLoginPage);

module.exports = router;
