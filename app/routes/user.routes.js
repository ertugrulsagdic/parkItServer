const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/live/density/data",
        [authJwt.verifyToken],
        controller.getLiveDensityData
    );

    app.post(
        "/api/add/entrance",
        [authJwt.verifyToken],
        controller.addEntrance
    );

    app.post(
        "/api/add/leaving",
        [authJwt.verifyToken],
        controller.addLeaving
    );

    app.get(
        "/api/get/user/payments/:userId",
        [authJwt.verifyToken],
        controller.getUserPayments
    );

};