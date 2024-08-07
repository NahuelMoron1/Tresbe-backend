import db from '../../db/connection';
import { DataTypes } from 'sequelize';

const PriceXproducts = db.define('PriceXproducts', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    optionID: {
        type: DataTypes.STRING,
    },
    priceList1: {
        type: DataTypes.FLOAT
    },
    priceList2: {
        type: DataTypes.FLOAT
    },
    priceList3: {
        type: DataTypes.FLOAT
    },
    priceList4: {
        type: DataTypes.FLOAT
    },
    priceListE: {
        type: DataTypes.FLOAT
    },
    priceListG: {
        type: DataTypes.FLOAT
    },
    costPrice: {
        type: DataTypes.FLOAT
    }
}, {timestamps: false})

export default PriceXproducts;