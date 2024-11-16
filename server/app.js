import express from 'express'
import http from 'http'
import {Server as SocketServer} from 'socket.io'
import cors from 'cors'
import db from '../database/db.js'
import UserRoutes from '../routes/routes.js'
import CardRoutes from '../routes/RoutesCard.js'
import QuestionsRoutes from '../routes/RoutesQuestions.js'
import OptionRoutes from '../routes/RoutesOption.js'
import VotesRoutes from '../routes/RoutesVotes.js'
import dotenv from 'dotenv'; 
import Usermodel from '../models/UsersModel.js'
import VotesModel from '../models/VotosMode.js'
import cardRouterid from '../routes/CardRouterid.js'
import CardModel from '../models/CardModel.js'
import jwt from 'jsonwebtoken';
 

dotenv.config();
console.log('SECRET_KEY:', process.env.SECRET_KEY);
const app  = express()
const server = http.createServer(app)


const io = new SocketServer(server,{
    cors: {
        origin: ["http://localhost:5173","http://localhost:5174"],
    }
})

/* rutas para la base de datos */
app.use(cors())
app.use(express.json())
app.use('/Usuarios',UserRoutes) 
app.use('/card',CardRoutes)
app.use('/questions',QuestionsRoutes)
app.use('/options',OptionRoutes)
app.use('/votes', VotesRoutes)
app.use('/idCard',cardRouterid)  

 
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
        const token = jwt.sign({ Cedula: user.Cedula,Nombre: user.Nombre}, secretKey, { expiresIn: '1s' });

        // Responder con el token
        return res.json({ token }); 

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
 

 app.post('/Validation', async (req, res) => {
    try {
        const { Cedula, Contraseña } = req.body;

        // Buscar usuario por cédula
        const user = await Usermodel.findOne({ where: { Cedula } });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (!user || Contraseña !== user.Contraseña) {
            return res.status(401).json({ success: false, message: 'Cedula o Contraseña incorrectos' });
        }
 
        // Verificar si el usuario ya ha votado buscando en la tabla VotesModel
        const existingVote = await VotesModel.findOne({ where: { id_voter: Cedula } });

        if (existingVote) {
            return res.status(403).json({ success: false, message: 'Este usuario ya ha votado.' });
        }

        // Si la cédula no está en la tabla VotesModel, se permite la votación
        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});



app.get ('/Link/:id', async (req, res) => { 
    try {
        const link = await CardModel.findOne({ where: { id: req.params.id },
            attributes: ['link'] 
        });
        if (!link) {
            return res.status(404).json({ message: 'Asamblea no encontrada' });
        }
        return res.json(link);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    } 
});

 
 

 const title ='' 
try {
    await db.authenticate()
    console.log('conexion ala base de datos exitosa ') 
} catch (error) {
    console.log('error en la conexion en la bd')
}
 
 
//respuestas del servidor
 app.get('/',(req,res)=>{
   res.send('hola mundo ')
   
  })  
  
   
  io.on('connection', (socket) => {
    console.log('A new client connected:', socket.id);
    socket.emit('bienvenida', `Bienvenido! Tu ID de socket es: ${socket.id}`);
  
    socket.on('iniciar', (msg) => {
      console.log('Recibido iniciar:', msg);
      // Considera si deberías usar broadcast o io.emit() dependiendo del contexto
      socket.broadcast.emit('I', msg);
    });
  
    socket.on('señal', (señal) => {
      console.log('Señal recibida:', señal);
      socket.broadcast.emit('M', señal);
    });
    app.post('/api/votacion/estado', async (req, res) => {
      const { Estado, id } = req.body; // Destructura 'estado' y 'id' del cuerpo de la solicitud
      
      try {
        // Utiliza el modelo para actualizar solo el 'estado' donde el 'id' coincide
        await CardModel.update(
        { Estado }, // Solo actualiza el campo 'estado'
        { where: { id } } // Condición para identificar el registro
      );
        
      // Enviar una respuesta al cliente indicando que la actualización fue exitosa
      res.status(200).json({ message: 'Estado actualizado correctamente' });
  
      // Emite el cambio a otros clientes si es necesario
    
      io.emit('iniciar', Estado); 
      
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      res.status(500).json({ message: 'Error al actualizar el estado' });
    } 
  });
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
    

  

app.get('/api/votacion/estado/:id', async (req, res) => {
    try {
      // Buscamos solo el campo 'Estado' para la tarjeta con el id especificado
      const card = await CardModel.findOne({
        attributes: ['Estado'], // Seleccionamos solo 'Estado'
        where: { id: req.params.id } // Condición para buscar el registro
      });
  
      // Si encontramos el registro, devolvemos solo el valor de 'Estado'
      if (card) {
        res.type('text/plain');  // Establecemos el tipo de contenido como texto plano
        res.send(card.Estado.toString());  // Enviar solo el valor como texto
      } else {
        res.send(null);  // Enviar 'null' si no se encuentra el registro
      } 
    } catch (error) {
      res.status(500).send('Error al obtener el estado');  // Error simple sin JSON
    } 
  });
  
    
server.listen(8000,()=>{
    console.log('server andando en el http://localhost:8000/')
}) 

   