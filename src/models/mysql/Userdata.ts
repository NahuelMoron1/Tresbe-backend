import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const Userdata = db.define('Userdata', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    firstname: {
        type: DataTypes.STRING,
    },
    lastname: {
        type: DataTypes.STRING
    },
    company: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    province: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    street: {
        type: DataTypes.STRING
    },
    streetNumb: {
        type: DataTypes.INTEGER
    },
    userID: {
        type: DataTypes.STRING
    },
    saveIt: {
        type: DataTypes.STRING
    }
})

export default Userdata;