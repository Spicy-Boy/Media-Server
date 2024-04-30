const router = require("express").Router();

const {
    renderHomepage 
} = require("../controllers/viewController");

router.get("/", renderHomepage);

module.exports = router;
