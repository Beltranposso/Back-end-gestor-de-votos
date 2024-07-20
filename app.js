import express from 'express'
import cors from 'cors'
import db from './database/db.js'
import UserRoutes from './routes/routes.js'
import CardRoutes from './routes/RoutesCard.js'
const app  = express()

app.use(cors())
app.use(express.json())
app.use('/Usuarios',UserRoutes)
app.use('/card',CardRoutes)

try {
    await db.authenticate()
    console.log('conexion ala base de datos exitosa ')
} catch (error) {
    console.log('error en la conexion en la bd')
}

/* app.get('/',(req,res)=>{
    res.send('hola mundo ')
}) */


app.listen(8000,()=>{
    console.log('server andando en el http://localhost:8000/')
})