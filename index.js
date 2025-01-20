const express = require('express');
const http = require('http');
const { Server: SocketServer } = require('socket.io');
const cors = require('cors');
const db = require('./database/db.js');
const UserRoutes = require('./routes/routes.js');
const CardRoutes = require('./routes/RoutesCard.js');
const QuestionsRoutes = require('./routes/RoutesQuestions.js');
const OptionRoutes = require('./routes/RoutesOption.js');
const VotesRoutes = require('./routes/RoutesVotes.js');
const dotenv = require('dotenv');
const Usermodel = require('./models/UsersModel.js');
const VotesModel = require('./models/VotosMode.js');
const cardRouterid = require('./routes/CardRouterid.js');
const CardModel = require('./models/CardModel.js');
const jwt = require('jsonwebtoken'); 
const ModelUserDefinitive = require('./routes/UserDefinitive.js');
const ModelUserD = require('./models/UsuariosModelD.js');
const cookie = require('cookie');
const RoutesPropuestas = require( './routes/routesPropuesta.js');
const ModelUser = require('./models/UsuariosModelD.js');
const userModel = require('./models/UsersModel.js');
const QuestionModel = require('./models/QuestionsModel.js');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
 
// Configuración de variables de entorno
dotenv.config();
console.log('SECRET_KEY:', process.env.SECRET_KEY);

const app = express();
const server = http.createServer(app);
 
// Configurar Socket.io
const io = new SocketServer(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Corregido "http//:" a "http://"
    }
}); 


app.use(cookieParser()); 
// Middleware para manejo de solicitudes
app.use(cors({ 
    /* origin: ['https://control360.co', 'https://controlvotantes360.co.control360.co'] */
    origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Si tu aplicación necesita cookies o autenticación basada en sesiones
}));
app.use(express.json()); 
   

app.get('/download-template', (req, res) => {
    const filePath = path.join(__dirname, 'upload', 'Plantilla.xlsx');

    // Verifica si el archivo existe
    res.download(filePath, 'Plantilla.xlsx', (err) => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
            res.status(500).json({ message: 'Error al descargar la plantilla' });
        }
    });
});










// Rutas
app.use('/Usuarios', UserRoutes);
app.use('/card', CardRoutes);
app.use('/questions', QuestionsRoutes);
app.use('/options', OptionRoutes);
app.use('/votes', VotesRoutes);  
app.use('/idCard', cardRouterid); 
app.use('/UsersDefinitive', ModelUserDefinitive); 
app.use('/Propuestas', RoutesPropuestas);

// Ruta de login
app.post('/login', async (req, res) => {
    try {
        const { Cedula, Contraseña } = req.body;

         

        const user = await Usermodel.findOne({ where: { Cedula } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        if (Contraseña !== user.Contraseña) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const cargos = {
            1: 'Administrador',
            2: 'Operador de registro',
            3: 'Coordinador'
        };

        const userCargo = cargos[user.cargo];
        if (!userCargo) {
            return res.status(403).json({ message: 'Cargo no autorizado' });
        }

        // Crear token incluyendo el campo 'id'
        const token = jwt.sign(
            { id: user.id, Cedula: user.Cedula, Nombre: user.Nombre, Cargo: userCargo },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Configurar la cookie del token
        res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
            httpOnly: true,
            secure: true, // true en producción
            sameSite: 'lax', // 'strict' o 'lax' según sea necesario
            path: '/',
            maxAge: 86400, // 1 día en segundos
        }));

        // Respuesta con información adicional
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                id: user.id,
                Cedula: user.Cedula,
                Nombre: user.Nombre,
                Cargo: userCargo
            }
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ message: 'Error en el servidor. Por favor intenta de nuevo más tarde.' });
    }
});





app.post('/Logout', (req, res) => {
    try {
        res.setHeader('Set-Cookie', cookie.serialize('auth_token', '', {
            httpOnly: true,
            secure: true, // Asegúrate de ajustarlo según el entorno
            sameSite: 'lax', // Igual que en el login
            path: '/',
            expires: new Date(0), // Fecha en el pasado para eliminar la cookie
        }));
        return res.status(200).json({ message: 'Sesión cerrada y cookie eliminada' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
});

// Ruta de validación
app.post('/Validation', async (req, res) => {
    try {
        const { Cedula, Contraseña } = req.body;
        const user = await Usermodel.findOne({ where: { Cedula } });

        if (!user || Contraseña !== user.Contraseña) {
            return res.status(401).json({ success: false, message: 'Cedula o Contraseña incorrectos' });
        } 

        const existingVote = await VotesModel.findOne({ where: { id_voter: Cedula } });

        if (existingVote) {
            return res.status(403).json({ success: false, message: 'Este usuario ya ha votado.' });
        }

        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para obtener enlace por ID
app.get('/Link/:id', async (req, res) => {
    try {
        const link = await CardModel.findOne({ where: { id: req.params.id }, attributes: ['link'] });
        if (!link) {
            return res.status(404).json({ message: 'Asamblea no encontrada' });
        }
        return res.json(link);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
(async () => {
    try {
        await db.authenticate();
       
    } catch (error) {
        console.log('Error en la conexión a la base de datos');
    }
})(); 

// Conexión a la base de datos
// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Hola mundo');
});

// Configuración de sockets
io.on('connection', (socket) => {
    console.log('A new client connected:', socket.id);
    socket.emit('bienvenida', `Bienvenido! Tu ID de socket es: ${socket.id}`);

    socket.on('iniciar', (msg) => {
        console.log('Recibido iniciar:', msg);
        socket.broadcast.emit('I', msg);
    });



    socket.on('CerrarPregunta', (close) => {
    
        socket.broadcast.emit('CL', close);     
    })
 
 
    socket.on('señal', (señal) => {
        socket.broadcast.emit('M',"user:"+ señal);
    }); 


        socket.on('stado', (estado) => {
      
        socket.broadcast.emit('ISO', "señal:",estado); 

    })



 

    socket.on('startCronometro', async (preguntaId) => {
        console.log('Iniciando cronómetro para pregunta:', preguntaId);
    
        try {
            // Obtener la pregunta desde la base de datos
            const question = await QuestionModel.findOne({
                where: { id: preguntaId },
                attributes: ['TiempoInicio', 'Duracion', 'Estado'], // Incluir 'Estado' para la validación inicial
            });
    
            if (!question) {
                socket.emit('error', 'Pregunta no encontrada');
                return;
            }
    
            const { TiempoInicio, Duracion, Estado } = question;
    
            // Si la pregunta ya está cerrada, enviar tiempo 0 y terminar
            if (Estado === 'Cerrada') {
                socket.emit('cronometro', { tiempoRestante: 0, terminado: true });
                return;
            }
    
            // Convertir TiempoInicio a formato válido
            const inicio = convertirFecha(TiempoInicio);
            console.log('TiempoInicio convertido:', inicio);
            if (!inicio) {
                socket.emit('error', 'El formato de TiempoInicio no es válido');
                return;
            }
    
            // Convertir Duración a número en segundos
            const duracionEnSegundos = parseInt(Duracion, 10);
            if (isNaN(duracionEnSegundos)) {
                socket.emit('error', 'Duración inválida');
                return;
            }
    
            // Iniciar cronómetro
            const interval = setInterval(async () => {
                try {
                    // Verificar el estado de la pregunta
                    const updatedQuestion = await QuestionModel.findOne({
                        where: { id: preguntaId },
                        attributes: ['Estado'],
                    });
    
                    if (!updatedQuestion) {
                        socket.emit('error', 'Pregunta no encontrada durante la verificación');
                        clearInterval(interval);
                        return;
                    }
    
                    if (updatedQuestion.Estado === 'Cerrada') {
                        // Detener el cronómetro si el estado es 'Cerrada'
                        socket.emit('cronometro', { tiempoRestante: 0, terminado: true });
                        clearInterval(interval);
                        return;
                    }
    
                    // Calcular tiempo restante
                    const ahora = Date.now();
                    console.log('Tiempo actual:', ahora); // Tiempo actual
                    const tiempoTranscurrido = Math.floor((ahora - inicio.getTime()) / 1000); // Diferencia en segundos
                    const tiempoRestante = duracionEnSegundos - tiempoTranscurrido;
    
                    if (tiempoRestante <= 0) {
                        // Enviar evento al cliente con tiempo restante 0 y estado terminado
                        socket.emit('cronometro', { tiempoRestante: 0, terminado: true });
    
                        // Actualizar el campo "Estado" a "Cerrada" en la base de datos
                        await QuestionModel.update(
                            { Estado: 'Cerrada' }, // Valor a actualizar
                            { where: { id: preguntaId } } // Condición para identificar la fila
                        );
    
                        clearInterval(interval); // Detener el cronómetro
                    } else {
                        // Enviar evento con el tiempo restante
                        socket.emit('cronometro', { tiempoRestante, terminado: false });
                        console.log('Tiempo restante:', tiempoRestante);
                    }
                } catch (error) {
                    console.error('Error al verificar el estado de la pregunta:', error);
                    socket.emit('error', 'Error durante la verificación del estado de la pregunta');
                    clearInterval(interval); // Detener en caso de error
                }
            }, 1000); // Actualizar cada segundo
    
            // Limpiar el intervalo si el cliente se desconecta
            socket.on('disconnect', () => {
                clearInterval(interval);
            });
        } catch (error) {
            console.error('Error en el cronómetro:', error);
            socket.emit('error', 'Error al iniciar el cronómetro');
        }
    });




    socket.on('Dataidpregunta', (m) => {
        console.log('Recibido:', m);    
        socket.broadcast.emit('DataQ', 'idpregunta:'+m);
    })  

    socket.on('Asistencia', (m) => {
  
        io.emit('ASIST', 'cedula votante:'+m);
    })
    
  
    app.post('/api/votacion/estado', async (req, res) => {
        const { Estado, id } = req.body; 
        try {
            await CardModel.update({ Estado }, { where: { id } });
            res.status(200).json({ message: 'Estado actualizado correctamente' });
            socket.emit('iniciar', Estado);
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
            res.status(500).json({ message: 'Error al actualizar el estado' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
    



}); 
function convertirFecha(fechaOriginal) {
    try {
        const [fecha, hora] = fechaOriginal.split(', ');
        const [dia, mes, anio] = fecha.split('/');
        
        // Crear la fecha usando el constructor con valores numéricos
        return new Date(
            parseInt(anio),
            parseInt(mes) - 1, // Los meses en JavaScript van de 0 a 11
            parseInt(dia),
            ...hora.split(':').map(Number)
        );
    } catch (error) {
        return null;
    }
}

// Ruta para obtener estado de votación por ID
app.get('/api/votacion/estado/:id', async (req, res) => {
    try {
        const card = await CardModel.findOne({ attributes: ['Estado'], where: { id: req.params.id } });
        if (card) {
            res.type('text/plain');
            res.send(card.Estado.toString());
        } else {
            res.send(null);
        }
    } catch (error) {
        res.status(500).send('Error al obtener el estado');
    }
});

app.post('/CreateExcel/:id_card', async (req, res) => {
    try {
        // Obtén el id_card de los parámetros de la ruta
        const { id_card } = req.params;

        // Valida que el cuerpo de la solicitud tenga datos
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un array no vacío' });
        }

        // Agrega el campo id_card a cada registro
        const dataConIdCard = req.body.map((registro) => ({
            ...registro,
            id_card: id_card, // Asigna el valor recibido desde la ruta 
        }));

        // Inserta los datos en la base de datos usando Sequelize
        await ModelUserD.bulkCreate(dataConIdCard);

        res.status(200).json({ message: 'Datos insertados correctamente' });
    } catch (error) {
        console.error('Error al insertar datos:', error);

        // Maneja errores específicos, como de validación o conexión
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }

        res.status(500).json({ message: 'Error al insertar datos' });
    }
});


app.get('/VotesOptions/:id', async (req, res) => {

/* Logica para ayar los resultados  por el quorum */

})


app.get('/DataAutenticathed', (req, res) => {
    console.log(req.cookies); // Verifica si la cookie está presente
    const token = req.cookies.auth_token; // Obtener el token de la cookie
  
    if (!token) {
      return res.status(401).json({ message: 'Token missing or expired' });
    }
  
    // Verificar y decodificar el token
    jwt.verify(token,  process.env.SECRET_KEY, (err, decoded) => {
      if(err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Si el token es válido, extraemos la cédula y el cargo
      const { Cedula, Cargo } = decoded;
      // Devolver la cédula y cargo al cliente
      res.json({ Cedula, Cargo });
    });
  });



  app.get('/get-user-info', (req, res) => {
    const token = req.cookies.auth_token; // Obtener el token de la cookie HttpOnly
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' }); // Si no hay token, responder con 401
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' }); // Si el token es inválido, responder con 403
      }
  
      // Extraer el rol (cargo) del token y devolverlo
      const { Cargo, Cedula,id} = decoded;
      console.log("Cargo a devolver :", Cargo);
      res.json({ Cargo , Cedula,id });
    });
  });



  app.get('/get-info-by-token', async (req, res) => {
    try {
        const token = req.cookies.auth_token; // Obtener el token de la cookie HttpOnly
  
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' }); // Si no hay token, responder con 401
        }
  
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Cambia SECRET_KEY por tu clave secreta
  
        // Extraer los datos del token
        const { Cargo } = decoded;
        const CedulaInt = parseInt(decoded.Cedula);

        // Buscar al usuario en la base de datos por la cédula
        const usuario = await userModel.findOne({
            where: { Cedula: CedulaInt },
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Responder con el cargo y el nombre del usuario
        res.json({
            Cargo,
            CedulaInt,
            Nombre: usuario.Nombre, // Asegúrate de que 'Nombre' sea el campo correcto en tu modelo
        }); 
    } catch (err) {
        console.error('Error al obtener información del usuario:', err);

        // Manejo de errores específicos
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        }

        res.status(500).json({
            message: 'Error interno del servidor',
            error: err.message
        });
    }
});
  
  app.get('/check-session', (req, res) => {
    const sessionCookie = req.cookies['session_token'];
    if (sessionCookie) {
      // Aquí puedes verificar el token en tu base de datos o sistema de autenticación
      const isValid = verifyToken(sessionCookie); // Supón que implementas esta función
      if (isValid) {
        return res.json({ isAuthenticated: true });
      }
    }
    res.json({ isAuthenticated: false });
  });


  app.get('/get-user-asistencia', async (req, res) => {
    try {
        const token = req.cookies.auth_token; // Obtener el token de las cookies
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' }); // Si no hay token, responder con 401
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const Cedula = parseInt(decoded.Cedula);

        // Buscar el usuario en la base de datos
        const user = await Usermodel.findOne({
            where: { Cedula },
            attributes: ['Asistencia'], // Solo obtener la columna 'asistencia'
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Responder con el estado de asistencia del usuario
        res.status(200).json({ asistencia: user.asistencia });
    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        res.status(500).json({ message: 'Error en el servidor. Por favor intenta de nuevo más tarde.' });
    }
});






  
  
app.post('/Check-user-token', async (req, res) => {
    try {
        // Obtener el token de las cookies
        const token = req.cookies.Token;
        console.log('Token recibido:', token);  // Log para verificar que el token está siendo enviado

        // Verificar si el token existe
        if (!token) {
            return res.status(400).json({
                message: "No se encontró el token en las cookies.",
                success: false
            });
        }

        // Decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Obtener la cédula desde el token decodificado
        const { Cedula } = decoded;
        console.log('Cédula decodificada:', Cedula); // Log para verificar la cédula

        // Verificar si la cédula está presente
        if (!Cedula) {
            return res.status(400).json({
                message: "Cédula no encontrada en el token.",
                success: false
            });
        }

        // Obtener el id_card desde el body de la solicitud
        const { id_card } = req.body; // Asegúrate de que el cliente envíe este dato en el cuerpo de la solicitud
        console.log('id_card recibido del body:', id_card); // Log para verificar el id_card recibido

        // Verificar si el id_card está presente
        if (!id_card) {
            return res.status(400).json({
                message: "ID de la tarjeta no proporcionado.",
                success: false
            });
        }

        // Convertir la cédula a tipo entero si no lo es
        const cedulaInt = parseInt(Cedula, 10); // Asegúrate de usar base 10 al convertir a entero
        console.log('Cédula convertida:', cedulaInt);

        // Verificar si la conversión fue exitosa
        if (isNaN(cedulaInt)) {
            return res.status(400).json({
                message: "La cédula no es válida.",
                success: false
            });
        }

        // Verificar si el usuario está registrado bajo el id_card
        const user = await ModelUser.findOne({
            where: { Cedula: cedulaInt, id_card }
        });

        if (!user) {
            return res.json({
                message: "No estás registrado en esta Asamblea.",
                success: false
            });
        }

        // Si el usuario está registrado
        return res.json({
            message: "El usuario está registrado en esta Asamblea.",
            success: true
        });

    } catch (error) {
        console.error("Error en el servidor:", error); // Log para detalles del error
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
});


app.post('/Check-user-vote', async (req, res) => {
    try {
        // Obtener el token de las cookies
        const token = req.cookies.Token;


        // Verificar si el token existe
        if (!token) {
            return res.status(400).json({
                message: "No se encontró el token en las cookies.",
                success: false
            });
        }

        // Decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Obtener la cédula desde el token decodificado
        const { Cedula } = decoded;
        console.log('Cédula decodificada:', Cedula); // Log para verificar la cédula

        // Verificar si la cédula está presente
        if (!Cedula) {
            return res.status(400).json({
                message: "Cédula no encontrada en el token.",
                success: false
            });
        }

        // Obtener el id_question desde el cuerpo de la solicitud
        const { id_question } = req.body;
        console.log('id_question recibido del body:', id_question); // Log para verificar el id_question recibido

        // Verificar si el id_question está presente
        if (!id_question) {
            return res.status(400).json({
                message: "ID de la pregunta no proporcionado.",
                success: false
            });
        }

        // Convertir la cédula a tipo entero si no lo es
        const cedulaInt = parseInt(Cedula, 10); // Asegúrate de usar base 10 al convertir a entero
        console.log('Cédula convertida:', cedulaInt);

        // Verificar si la conversión fue exitosa
        if (isNaN(cedulaInt)) {
            return res.status(400).json({
                message: "La cédula no es válida.",
                success: false
            });
        }

        // Verificar si el usuario ya votó en la pregunta específica
        const vote = await VotesModel.findOne({
            where: { id_voter: cedulaInt, id_question }
        });

        if (!vote) {
            return res.json({
                message: "El usuario no ha votado en esta pregunta.",
                success: true
            });
        }

        // Si el usuario ya votó en esta pregunta
        return res.json({
            message: "El usuario ya votó en esta pregunta.",
            success: false
        });

    } catch (error) {
        console.error("Error en el servidor:", error); // Log para detalles del error
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
});







// Configurar el puerto desde la variable de entorno o usar un valor por defecto
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Servidor andando en el http://localhost:${PORT}`);
});
