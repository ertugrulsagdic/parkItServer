module.exports = (sequelize, Sequelize) => {
    const Parking_Lot = sequelize.define('parking_lots', {
        name: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING
        },
        capacity: {
            type: Sequelize.INTEGER
        },
        number_of_empty_spaces: {
            type: Sequelize.INTEGER
        },
        density: {
            type: Sequelize.FLOAT
        },
        number_of_parking_cars: {
            type: Sequelize.INTEGER
        },
        hourly_price: {
            type: Sequelize.FLOAT
        },
        monthly_price: {
            type: Sequelize.FLOAT
        },
        lattitude: {
            type: Sequelize.FLOAT
        },
        langtitute: {
            type: Sequelize.FLOAT
        },
    });

    return Parking_Lot;
};