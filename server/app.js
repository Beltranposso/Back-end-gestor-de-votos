import express from 'express'
import http from 'http'
import {Server as SocketServer} from 'socket.io'
import cors from 'cors'
import db from '../database/db.js'
import UserRoutes from '../routes/routes.js'
import CardRoutes from '../routes/RoutesCard.js'
import QuestionsRoutes from '../routes/RoutesQuestions.js'
import OptionRoutes from '../routes/RoutesOption.js'
import dotenv from 'dotenv'; 
import Usermodel from '../models/UsersModel.js'
import jwt from 'jsonwebtoken';

dotenv.config();
console.log('SECRET_KEY:', process.env.SECRET_KEY);
const app  = express()
const server = http.createServer(app)


const io = new SocketServer(server,{
    cors: {
        origin: " http://localhost:5173",
    }
})

/* rutas para la base de datos */
app.use(cors())
app.use(express.json())
app.use('/Usuarios',UserRoutes)
app.use('/card',CardRoutes)
app.use('/questions',QuestionsRoutes)
app.use('/options',OptionRoutes)


app.post('/login', async (req, res) => {
    const secretKey = process.env.SECRET_KEY;

    try {
        if (!secretKey) { 
            throw new Error('SECRET_KEY is not defined in .env file');
        }
        const { Cedula, Contraseña } = req.body;
        const user = await Usermodel.findOne({ where: { Cedula } });

        if (!user || Contraseña !== user.Contraseña) {
            return res.status(401).json({ message: 'Cedula o Contraseña incorrectos' });
        }

        // Generar el token
        const token = jwt.sign({ Cedula: user.Cedula,Nombre: user.Nombre}, secretKey, { expiresIn: '10s' });

        // Responder con el token
        return res.json({ token }); 

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


  
try {
    await db.authenticate()
    console.log('conexion ala base de datos exitosa ')
} catch (error) {
    console.log('error en la conexion en la bd')
}
 

//respuestas del servidor
/* app.get('/',(req,res)=>{
    res.send('hola mundo ')
}) */

/* io.on('connection', socket=> {
    console.log('a new client connected')
})
  */


server.listen(8000,()=>{
    console.log('server andando en el http://localhost:8000/')
})