module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define('payments', {
        entrance_time: {
            type: Sequelize.DATE
        },
        leaving_time: {
            type: Sequelize.DATE
        },
        total_price: {
            type: Sequelize.FLOAT
        },
    });

    return Payment;
};