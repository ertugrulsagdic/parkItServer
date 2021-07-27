const express = require("express");
const cors = require("cors");

var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
    origin: 'https://localhost:8081'
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('json spaces', '  ');

const db = require("./app/models");
const Role = db.role;
const Parking_Lot = db.parking_lot;
const User = db.user;

const Op = db.Sequelize.Op;

db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync DB');
    initial();
});

function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "admin"
    });

    Parking_Lot.create({
        name: "ERTUGRUL's PARKING LOT",
        code: "ERTLOT",
        capacity: 100,
        number_of_empty_spaces: 100,
        density: 0.0,
        number_of_parking_cars: 0,
        hourly_price: 5.0,
        monthly_price: 100.0,
        lattitude: 40.99105458510394,
        langtitute: 29.05716816227539,
    });

    Parking_Lot.create({
        name: "MDP GROUP PARKING LOT",
        code: "MDPGRP",
        capacity: 300,
        number_of_empty_spaces: 300,
        density: 0.0,
        number_of_parking_cars: 0,
        hourly_price: 10.0,
        monthly_price: 300.0,
        lattitude: 40.96862198954696,
        langtitute: 29.1013858200151,
    });

    User.create({
        username: "admin",
        password: bcrypt.hashSync('admin', 8),
        email: "admin@admin.com",
    }).then(user => {
        Role.findAll({
            where: {
                name: {
                    [Op.or]: ["user", "admin"]
                }
            }
        }).then(roles => {
            user.setRoles(roles).then(() => {
                console.log("User is registered successfully!");
            });
        });
    });


}

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Partkit Server",
        authServices: "Below two service is for the authentication.",
        "/api/auth/signup": "This service is to register user into the system. It basically creates a User instance with email, username, and password, and roles (user or admin). Password is HASH'ed using bcrypt.hashSync() function.",
        "/api/auth/signin": "This service is to log the user into the system. It takes username and pasword and returns user information with jwt token. Jwt token is jsonwebtoken which is created for each user. It will be used in order to check the credentials of the user whether is has a role as admin or not. It should be sent as a x-access-code header.",
        userServices: "Below four services is for the users who has only user role.",
        "/api/live/density/data": "This service is to get the denstity information of the parking lots registered in the system. It returns the name, number_of_empty_spaces, density, and hourly_price information of the parking lots.",
        "/api/add/entrance": "This service is to let user enter the parking lot with QR code. It takes code and user_id as request body and responses wheter the server did the task successful or not.",
        "/api/add/leaving": "This service is to let user exit the parking lot with QR code. It takes code and user_id as request body. It calculates the total price from the entrance time and leaving time. And it returns wheter server did the task successful or not.",
        "/api/get/user/payments/:userId": "This service is to get user payments with userId taken from the request URL as parameter. and it returns id, parking_lot_id, parking_lot_name, entrance_time, leaving_time, and total_price infromation as a response.",
        adminServices: "Below three services is for the users who has admin role.",
        "/api/get/all/payments": " This service is to get all payments. It returns id, parking_lot_id, user_id, username, email, parking_lot_name, entrance_time, leaving_time, and total_price information as a response.",
        "/api/get/payments/by/date": "This service is to get all payments between two dates. It has the same response body with the previous service how ever it is restricted to return start_date and end_date iformation taken by request body. The date format is YYYY-MM-DD HH:MM:SS.",
        "/api/get/users": "This service is to get all users."
    });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})