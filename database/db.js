import { Sequelize } from "sequelize"

const db =  new Sequelize  ('app_users','root','', {
    host: 'localhost',
    dialect: 'mysql',
})

export default db