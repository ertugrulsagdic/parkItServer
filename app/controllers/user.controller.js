const db = require("../models");
const Parking_Lot = db.parking_lot;
const Payment = db.payment;

//api/live/density/data
exports.getLiveDensityData = async (req, res) => {

    await Parking_Lot.findAll().then(parkingLots => {
        liveDensityData = {};

        liveDensityData.status = true;
        const newParkingLots = parkingLots.map((parkingLot) => {
            const { name, number_of_empty_spaces, density, hourly_price } = parkingLot
            return { name, number_of_empty_spaces, density, hourly_price }
        })

        liveDensityData.parking_lots = newParkingLots;

        res.status(200).json(liveDensityData);
    }).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    });

};

//api/add/entrance
exports.addEntrance = (req, res) => {

    Parking_Lot.findOne({
        where: {
            code: req.body.code
        }
    }).then(parkingLot => {

        Payment.findOne({
            where: {
                userId: req.body.user_id,
                parkingLotId: parkingLot.id,
                leaving_time: null
            }
        }).then(isUnique => {
            if (!isUnique) {
                Payment.create({
                    entrance_time: new Date(),
                    leaving_time: null,
                    total_price: null,
                    parkingLotId: parkingLot.id,
                    userId: req.body.user_id
                }).then(() => {
                    res.status(200).json({ status: true, message: "You have entered parking lot successfully!" });
                }).catch(err => {
                    res.status(404).send({ status: false, message: err.message });
                });
            } else {
                res.status(404).send({ status: false, message: "You can not enter parking lot twice!" });
            }
        });

    }).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    });

};

//api/add/leaving
exports.addLeaving = (req, res) => {

    Parking_Lot.findOne({
        where: {
            code: req.body.code
        }
    }).then(parkingLot => {

        Payment.findOne({
            where: {
                userId: req.body.user_id,
                parkingLotId: parkingLot.id,
                leaving_time: null
            }
        }).then(payment => {
            entrance = payment.entrance_time;
            leaving = new Date();
            // calculate the hours 
            var hours = (leaving.getTime() - entrance.getTime()) / 3600000;
            // calculate the total price
            var total_price = Math.round((hours * parkingLot.hourly_price + Number.EPSILON) * 100) / 100;


            Payment.update({ leaving_time: leaving, total_price: total_price }, {
                where: {
                    id: payment.id
                }
            }).then(() => {
                res.status(200).send({ status: true, message: "You have left parking lot successfully!" });
            }).catch(err => {
                res.status(404).send({ status: false, message: err.message });
            });

        }).catch(err => {
            res.status(404).send({ status: false, message: err.message });
        });

    }).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    });

};

//api/get/user/payments/:userId
exports.getUserPayments = (req, res) => {
    const { userId } = req.params

    Payment.findAll({
        where: {
            userId: userId,
        }
    }).then((payments) => {

        userPayments = {};

        const newUserPayments = payments.map(async (payment) => {

            const { id, entrance_time, leaving_time, total_price } = payment;

            const { parking_lot_id, parking_lot_name } = await Parking_Lot.findByPk(payment.parkingLotId).then((parkingLot) => {
                const parking_lot_id = parkingLot.id;
                const parking_lot_name = parkingLot.name;
                return { parking_lot_id, parking_lot_name }

            }).catch(err => {
                res.status(404).send({ status: false, message: err.message });
            });

            return { id, parking_lot_id, parking_lot_name, entrance_time, leaving_time, total_price }
        });

        Promise.all(newUserPayments).then((resolvedUserPayments) => {
            userPayments.status = true;
            userPayments.user_payments = resolvedUserPayments;

            res.status(200).json(userPayments);
        }).catch(err => {
            res.status(404).send({ status: false, message: err.message });
        });


    }).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    });
};

