const router = require("express").Router();
const Controller = require("../controllers");
const destinationPath = require("./destinations");
const hotelPath = require("./hotels");

const userRouter = require("./users");
// const favouriteRouter = require("./favourites");
const travelStepRouter = require("./travelSteps");
const provincesRouter = require("./provinces");
const reviewsRouter = require("./reviews");
const publicsRouter = require("./public");
const cityRouter = require("./cities");
const Authentication = require("../middlewares/Authentication");

// Register & Login
router.post("/register", Controller.register);
router.post("/login", Controller.login);

router.use("/publics", publicsRouter);
router.use(Authentication.verify);

// User
router.use("/users", userRouter);

// TravelSteps
router.use("/travel-steps", travelStepRouter);

// Destinations
router.use("/destinations", destinationPath);

// Hotels
router.use("/hotels", hotelPath);

router.use(provincesRouter); // Provinces
router.use(reviewsRouter); // Reviews
router.use(cityRouter); // City
module.exports = router;
