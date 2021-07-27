const db = require("../models");
const User = db.user;
const Parking_Lot = db.parking_lot;
const Payment = db.payment;

const Op = db.Sequelize.Op;

//api/get/all/payments
exports.getAllPayments = (req, res) => {
    Payment.findAll().then((payments) => {

        allPayments = {};

        const newAllPayments = payments.map(async (payment) => {

            const { id, entrance_time, leaving_time, total_price } = payment;

            const { parking_lot_id, parking_lot_name } = await Parking_Lot.findByPk(payment.parkingLotId).then((parkingLot) => {
                const parking_lot_id = parkingLot.id;
                const parking_lot_name = parkingLot.name;
                return { parking_lot_id, parking_lot_name }

            }).catch(err => {
                res.status(404).send({ status: false, message: err.message });
            });

            const { user_id, username, email } = await User.findByPk(payment.userId).then((user) => {
                const user_id = user.id;
                const username = user.username;
                const email = user.email;
                return { user_id, username, email }
            }).catch(err => {
                res.status(404).send({ status: false, message: err.message });
            });

            return { id, parking_lot_id, user_id, username, email, parking_lot_name, entrance_time, leaving_time, total_price }
        });

        Promise.all(newAllPayments).then((resolvedAllPayments) => {
            allPayments.status = true;
            allPayments.all_payments = resolvedAllPayments;

            res.status(200).json(allPayments);
        }).catch(err => {
            res.status(404).send({ status: false, message: err.message });
        });


    }).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    });
};

//api/get/payments/by/date
exports.getPaymentsByDateStartToEnd = (req, res) => {
    const { start_date, end_date } = req.body;

    const start = new Date(start_date);
    const end = new Date(end_date)

    Payment.findAll({
        where: {
            entrance_time: {
                [Op.between]: [start, end]
            }
        }
    }).then((payments) => {
        console.log(payments)
        allPayments = {};

        const newAllPayments = payments.map(async (payment) => {

            const { id, entrance_time, leaving_time, total_price } = payment;

            const { parking_lot_id, parking_lot_name } = await Parking_Lot.findByPk(payment.parkingLotId).then((parkingLot) => {
                const parking_lot_id = parkingLot.id;
                const parking_lot_name = parkingLot.name;
                return { parking_lot_id, parking_lot_name }

            }).catch(err => {
                res.status(404).send({ status: false, message: err.message });
            });

            const { user_id, username, email } = await User.findByPk(payment.userId).then((user) => {
                const user_id = user.id;
                const username = user.username;
                const email = user.email;
                return { user_id, username, email }
            }).catch(err => {
                res.status(404).send({ status: false, message: err.message });
            });

            return { id, parking_lot_id, user_id, username, email, parking_lot_name, entrance_time, leaving_time, total_price }
        });

        Promise.all(newAllPayments).then((resolvedAllPayments) => {
            allPayments.status = true;
            allPayments.all_payments = resolvedAllPayments;

            res.status(200).json(allPayments);
        }).catch(err => {
            res.status(404).send({ status: false, message: err.message });
        });


    }).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    });
};

//api/get/users
exports.getUsers = (req, res) => {

    User.findAll().then((users => {
        const allUsers = {};

        const newAllUsers = users.map(user => {
            const { id, username, email } = user;

            return { id, username, email }
        })

        allUsers.status = true;
        allUsers.users = newAllUsers;

        res.status(200).send(allUsers);

    })).catch(err => {
        res.status(404).send({ status: false, message: err.message });
    })
};
