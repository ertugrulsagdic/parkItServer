const { authJwt } = require("../middleware");
const controller = require("../controllers/admin.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/get/all/payments",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllPayments
    );

    app.post(
        "/api/get/payments/by/date",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getPaymentsByDateStartToEnd
    );

    app.get(
        "/api/get/users",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getUsers
    );


};