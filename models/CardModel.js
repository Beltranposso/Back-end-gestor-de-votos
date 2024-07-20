import db from "../database/db.js";
import { DataTypes} from "sequelize";


const Votacion = db.define('cards',{
    Title: {type: DataTypes.STRING},
    Content: {type: DataTypes.STRING},
    Color:{type: DataTypes.STRING}

})

export default Votacion  