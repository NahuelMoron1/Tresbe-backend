import { DataTypes } from "sequelize";
import db from "../../db/connection";

const Brands = db.define(
  "Brands",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  },
  { timestamps: false }
);

export default Brands;
