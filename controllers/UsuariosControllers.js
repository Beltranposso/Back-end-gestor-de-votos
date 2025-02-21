const ModelUser = require('../models/UsuariosModelD.js');
const VotesModel = require('../models/VotosMode.js');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const client =require( '../redis/redisClient.js');
const { QuestionsModel, OptionsModel, Votos, UsuariosDefinitive } = require('../models/asociations.js');
 

// const dotenv = require('dotenv'); // Si es necesario, puedes descomentar esta línea


// Métodos para el CRUD

// Este método muestra todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const Users = await ModelUser.findAll();
        res.json(Users);
    } catch (error) {
        console.log("Hubo un error al traer los usuarios");
        res.json({
            "message": error.message 
        });
    }
};
exports.getAllUsersCounter = async (req, res) => {
    try {
        const { id_card } = req.params; // Obtener id_card de los parámetros de la URL
        const users = await ModelUser.findAll({
            where: { id_card } // Filtro por id_card
        });
        
        // Responder con los usuarios encontrados
        res.status(200).json({ 
            count: users.length,
            users 
        });
    } catch (error) {
        console.error("Hubo un error al traer los usuarios por id_card:", error);
        res.status(500).json({
            message: "Hubo un error al traer los usuarios",
            error: error.message
        });
    }
};


// Este método muestra ciertos usuarios

exports.getUser = async (req, res) => {
    try {
        const user = await ModelUser.findAll({
            where: { id_card: req.params.id_card    }
        });

        if (user.length === 0) {
            // Si no se encuentra ningún usuario, se retorna un JSON predeterminado
            return res.json({
                message: "No hay usuarios",
                id_card: req.params.id_card,
                data: null
            });
        }

        // Si se encuentran usuarios, se retorna el resultado
        res.json(user);
    } catch (error) {
        console.error("Hubo un error al traer los usuarios:", error.message);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

exports.getUserPull = async (req, res) => {
    try {
        const userId = req.params.id;
        const cacheKey = `user_${userId}`;  // Definimos la clave para almacenar en caché

        // 1. Intentamos obtener el usuario del caché
        const cachedUser = cache.get(cacheKey);

        if (cachedUser) {
            // Si hay un caché, retornamos los datos desde allí
            console.log("Datos obtenidos desde el caché");
            return res.json(cachedUser);
        }

        // 2. Si no está en caché, lo obtenemos de la base de datos
        const user = await ModelUser.findOne({
            where: { id: userId }
        });

        if (!user) {
            // Si no se encuentra ningún usuario, retornamos un mensaje predeterminado
            return res.json({
                message: "No se encontró el usuario",
                id_card: req.params.id_card,
                data: null
            });
        }

        // 3. Guardamos los datos en caché por 10 minutos
        cache.put(cacheKey, user, 600000); // 600000 ms = 10 minutos

        console.log("Datos obtenidos de la base de datos");
        // 4. Retornamos el usuario
        res.json(user);

    } catch (error) {
        console.error("Hubo un error al traer el usuario:", error.message);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};



// Este método crea un registro
exports.createUser = async (req, res) => {
    try {
        await ModelUser.create(req.body);
        res.json({
            "message": "El registro fue exitoso"
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Este método actualiza la información de un usuario
exports.updateUser = async (req, res) => {
    console.log(req.body);
    try {
        // Verificar si el usuario existe
        const user = await ModelUser.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: `Usuario con ID ${req.params.id} no encontrado`
            });
        }

        // Actualizar la información del usuario
        await user.update(req.body);
        res.json({
            message: "Se actualizó correctamente la información",
            data: user // Retorna los datos actualizados
        });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error.message);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Este método elimina a un usuario 
exports.DeleteUser = async (req, res) => {
    try {
        // Intenta eliminar el usuario
        const rowsDeleted = await ModelUser.destroy({
            where: { Cedula: req.params.Cedula }
        });

        // Verifica si algún usuario fue eliminado
        if (rowsDeleted) {
            res.json({
                message: "Usuario eliminado correctamente."
            });
        } else {
            res.status(404).json({
                message: "Usuario no encontrado."
            });
        }
    } catch (error) {
        // Maneja errores y envía la respuesta
        res.status(500).json({
            message: "Error al eliminar el usuario.",
            error: error.message
        });
    }
};
exports.getVotosByCardIdAndEstado = async (req, res) => {
    try {
        const votos = await ModelUser.findAll({
            where: {
                id_card: req.params.id_card, // Filtra por id_card
                EstadoVoto: "No",
                esRepresentado: "No"         
            }
        });
        res.json(votos);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};



exports.SetAsistencia = async (req, res) => {
    try {
        // Obtener la cédula desde los parámetros de la solicitud
        const cedula = req.params.Cedula;
        const { asistencia } = req.body; // Asegúrate de recibir el valor de asistencia desde el cliente

        // Verificar que se recibió la cédula y asistencia
        if (!cedula || asistencia === undefined) {
            return res.status(400).json({
                message: "La cédula y el estado de asistencia son obligatorios.",
            });
        }

        // Buscar el usuario en la base de datos por la cédula
        const user = await ModelUser.findOne({ where: { Cedula: cedula } });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        // Obtener la fecha y hora actuales en un formato legible
        const fechaHoraActual = new Date().toLocaleString("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        // Actualizar la asistencia del usuario principal
        await ModelUser.update(
            { 
                Asistencia: asistencia,
                HoraDellegada: asistencia === "Presente" ? fechaHoraActual : null 
            }, 
            { where: { Cedula: cedula } }
        );

        // Si el usuario tiene apoderados, actualizar su asistencia también
        if (user.Apoderados) {
            try {
                const apoderados = JSON.parse(user.Apoderados); // Convertir de string a JSON
                
                if (Array.isArray(apoderados) && apoderados.length > 0) {
                    // Extraer las cédulas de los apoderados
                    const cedulasApoderados = apoderados.map(apoderado => apoderado.id);

                    // Actualizar la asistencia de todos los apoderados
                    await ModelUser.update(
                        { 
                            Asistencia: asistencia // Sincronizar la asistencia de los apoderados con la del usuario principal
                        },
                        { where: { id: cedulasApoderados } }
                    );
                }
            } catch (error) {
                console.error("Error al procesar los apoderados:", error);
            }
        }

        // Buscar nuevamente al usuario actualizado para confirmarlo
        const updatedUser = await ModelUser.findOne({ where: { Cedula: cedula } });

        // Enviar respuesta con el usuario actualizado
        res.json({
            message: "La asistencia del usuario y de sus apoderados se actualizó correctamente.",
            usuario: updatedUser
        });
    } catch (error) {
        console.log("Hubo un error al actualizar la asistencia del usuario:", error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};
 

exports.verifyUserByCedula = async (req, res) => {
    try {
        // Obtener la cédula desde el cuerpo de la solicitud
        const { Cedula } = req.body; // Asegúrate de enviar la cédula en el body de la petición
        const idCard = req.params.id_card; // Obtener el id_card de los parámetros de la ruta

        // Verificar si la cédula está presente en el body
        if (!Cedula) {
            return res.status(400).json({
                message: "Cédula no proporcionada.",
                verified: false
            });
        }

        // Buscar usuarios asociados al id_card
        const users = await ModelUser.findAll({
            where: { id_card: idCard }
        });

        if (users.length === 0) {
            // Si no hay usuarios asociados al id_card
            return res.json({
                message: "No hay usuarios asociados a este id_card.",
                verified: false
            });
        }

        // Verificar si la cédula se encuentra entre los usuarios
        const userExists = users.some(user => user.Cedula === Cedula);

        if (!userExists) {
            return res.json({
                message: "La cédula no se encuentra entre los usuarios asociados.",
                verified: false
            });
        }

        // Si la cédula coincide
        res.json({
            message: "Cédula verificada exitosamente.",
            verified: true
        });

    } catch (error) {
        console.error("Error al verificar el usuario por cédula:", error.message);
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
};


 // Asegúrate de instalar jsonwebtoken si no lo tienes instalado

 exports.checkVotingStatusByIdCard = async (req, res) => {
    try {
        const { Cedula } = req.body;
        const idCard = req.params.id_card;

        if (!Cedula) {
            return res.status(400).json({ message: "Cédula no proporcionada.", success: false });
        }

        if (!idCard) {
            return res.status(400).json({ message: "ID de la tarjeta (id_card) no proporcionado.", success: false });
        }

        // Verificar si el token existe en Redis
        const token = req.cookies.Token;
        if (token) {
            const cachedData = await client.get(`token:${token}`);
            if (!cachedData) {
                // Si el token no existe en Redis, elimina la cookie
                res.clearCookie('Token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/'
                });
                return res.status(401).json({ message: "Token no válido o expirado.", success: false });
            }
        }

        // 🔹 Verificar si los datos ya están en Redis
        const cachedData = await client.get(`userData:${Cedula}:${idCard}`);
        if (cachedData) {
            return res.json({
                message: "Datos obtenidos desde caché.",
                success: true,
                data: JSON.parse(cachedData)
            });
        }

        // 🔹 Consultar la base de datos solo si los datos no están en caché
        const user = await ModelUser.findOne({
            where: { Cedula, id_card: idCard },
            attributes: ['Nombre', 'Apellido', 'quorum', 'RegisterQuorum', 'PoderesDelegados', 'esRepresentado'] // Agregar 'esRepresentado'
        });

        if (!user) {
            return res.json({ message: "No estás registrado en esta Asamblea.", success: false });
        }

        // 🔹 Extraer los datos del usuario
        const { Nombre, Apellido, quorum, RegisterQuorum, PoderesDelegados, esRepresentado } = user;
        const userData = { Cedula, idCard, NombreCompleto: `${Nombre} ${Apellido}`, quorum, RegisterQuorum, PoderesDelegados };

        // 🔹 Verificar si el usuario es representado
        if (esRepresentado === "P") {
            return res.json({
                message: "El usuario es representado y no requiere un token."
            });
        }

        // 🔹 Generar el token solo si el usuario no es representado
        const newToken = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '1d' });
        console.log('Token generado:', newToken);

        // 🔹 Guardar los datos en Redis (expiración 1 día)
        await client.setEx(`token:${newToken}`, 86400, JSON.stringify(userData));
        console.log('Datos guardados en Redis:', userData); 

        // 🔹 Establecer la cookie con el token
        res.cookie('Token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Cambia a true en producción
            maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });

        return res.json({
            message: "Usuario registrado. Token generado y datos almacenados en caché.",
            success: true,
            token: newToken
        });

    } catch (error) {
        console.error("Error al verificar el estado de votación:", error.message);
        res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
};

exports.decodeToken = async (req, res) => { 
    try {
        const token = req.cookies.Token;

        if (!token) {
            return res.status(400).json({
                message: "Token no proporcionado.",
                success: false
            });
        }
console.log("token deodificado:",token)
        // 🔹 Verificar si el token está en Redis
        const cachedUserData = await client.get(`token:${token}`);
        if (cachedUserData) {
            return res.json({
                message: "Token encontrado en caché.",
                success: true,
                userData: JSON.parse(cachedUserData) // Convertir a objeto
            });
        }

        // 🔹 Si no está en Redis, decodificarlo
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // 🔹 Guardar los datos decodificados en Redis con expiración (1 día)
        await client.setEx(`token:${token}`, 86400, JSON.stringify(decoded));

        return res.json({
            message: "Token decodificado exitosamente.",
            success: true,
            userData: decoded
        });

    } catch (error) {
        console.error("Error al decodificar el token:", error.message);

        if (error.name === 'TokenExpiredError') {
            // 🔹 Si el token expiró, eliminarlo de Redis y responder con error
            await client.del(`token:${req.cookies.Token}`);
            return res.status(401).json({
                message: "El token ha expirado.",
                success: false
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
};



exports.checkVotingStatusFromToken = async (req, res) => {
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

        // Obtener la cédula y el id_card desde el token decodificado
        const { Cedula, id_card } = decoded;

        // Verificar si la cédula y el id_card están presentes
        if (!Cedula || !id_card) {
            return res.status(400).json({
                message: "Cédula o ID de la tarjeta no encontrados en el token.",
                success: false
            });
        }

        // Convertir la cédula a tipo entero si no lo es
        Cedula = parseInt(Cedula, 100);  // Asegúrate de usar base 10 al convertir a entero

        // Verificar si la conversión fue exitosa
        if (isNaN(Cedula)) {
            return res.status(400).json({
                message: "La cédula no es válida.",
                success: false
            });
        }

        // Verificar si el usuario está registrado bajo el id_card
        const user = await ModelUser.findOne({
            where: { Cedula, id_card }
        });

        if (!user) {
            return res.json({
                message: "No estás registrado en esta Asamblea.",
                success: false
            });
        }

        // Verificar si el usuario ya votó en la tabla VotesModel
        const voteRecord = await VotesModel.findOne({
            where: { id_voter: Cedula }
        });

        if (voteRecord) {
            return res.json({
                message: "El usuario ya ha votado.",
                success: false
            });
        }

        // Si el usuario está registrado y no ha votado
        return res.json({
            message: "El usuario está registrado y no ha votado aún.",
            success: true
        });

    } catch (error) {
        console.error("Error al verificar el estado de votación desde el token:", error.message);
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
};








exports.debugToken = (req, res) => {
    try {
        // Obtener el token de las cookies
        console.log(req.cookies.Token);
        const token = req.cookies.Token;

        if (!token) {
            return res.status(400).json({
                message: "No se encontró el token en las cookies."
            });
        }

        // Decodificar el token (por ejemplo, usando JWT)
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Obtener la cédula del token decodificado
        const { Cedula, id_card } = decoded;

        if (!Cedula) {
            return res.status(400).json({
                message: "No se encontró la cédula en el token."
            });
        }

        // Cifrar la cédula
        const secretKey = process.env.CEDULA_SECRET_KEY || "miClaveSecreta";
        const cipher = crypto.createCipher("aes-256-cbc", secretKey);
        let encryptedCedula = cipher.update(Cedula, "utf8", "hex");
        encryptedCedula += cipher.final("hex");

        res.status(200).json({
            Cedula: encryptedCedula,
            id_card: id_card
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};




exports.getAsistencia = async (req, res) => {
    try {
        const token = req.cookies.Token; // Obtén el token de las cookies
        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Decodifica el token
        console.log("Token decodificado:", decoded);

        const cedula = parseInt(decoded.Cedula); // Obtén la cédula
        if (!cedula) {
            return res.status(400).json({ message: "El token no contiene una cédula válida" });
        }
        console.log("Cédula obtenida:", cedula);

        const user = await ModelUser.findOne({
            where: { Cedula: cedula },
            attributes: ['Asistencia'], // Solo selecciona la columna 'Asistencia'
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        res.json({
            message: "Valor de Asistencia obtenido exitosamente.",
            Asistencia: user.Asistencia, // Devuelve la asistencia
        });
    } catch (error) {
        console.error("Error al obtener el valor de Asistencia:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


exports.calcularQuorumTotal = async (req, res) => {
    const { idCard } = req.params;

    try {
        // Validar que idCard no esté vacío
        if (!idCard) {
            return res.status(400).json({
                message: 'Se requiere un ID de tarjeta válido'
            });
        }

        // Obtener todos los usuarios presentes con el filtro 'Asistencia: Presente'
        const usuariosPresentes = await ModelUser.findAll({
            where: {
                Asistencia: 'Presente',
                id_card: idCard
            },
            attributes: ['Nombre', 'Cedula', 'quorum', 'esRepresentado']
        });

        // Obtener todos los usuarios registrados para la asamblea
        const usuariosRegistrados = await ModelUser.findAll({
            where: { id_card: idCard },
            attributes: ['id']
        });

        // Contar el total de usuarios registrados
        const totalUsuariosRegistrados = usuariosRegistrados.length;

        // Filtrar los usuarios presentes donde 'esRepresentado' sea 'No'
        const usuariosFiltrados = usuariosPresentes.filter(
            usuario => usuario.esRepresentado === 'No'
        );

        // Calcular el quórum total solo de los usuarios filtrados
        const quorumTotal = usuariosFiltrados.reduce((acc, usuario) => {
            const quorum = parseFloat(usuario.quorum) || 0;
            return acc + quorum;
        }, 0);

        // Número total de usuarios presentes
        const numeroUsuariosPresentes = usuariosPresentes.length;

        // Limitar el quórum total a 6 decimales
        const quorumTo = parseFloat(quorumTotal.toFixed(6));

        console.log(`Quorum total de la asamblea para id_card ${idCard}: ${quorumTo}`);
        console.log(`Número total de usuarios presentes: ${numeroUsuariosPresentes}`);
        console.log(`Número total de usuarios registrados: ${totalUsuariosRegistrados}`);

        // Responder con los datos calculados
        return res.status(200).json({
            message: `Cálculo de quórum para id_card ${idCard}`,
            quorumTotal: quorumTo,
            numeroUsuariosPresentes,
            totalUsuariosRegistrados,
            usuariosFiltrados: usuariosFiltrados.map(usuario => ({
                nombre: usuario.Nombre,
                cedula: usuario.Cedula,
                quorum: usuario.quorum
            })),
            usuariosPresentes: usuariosPresentes.map(usuario => ({
                nombre: usuario.Nombre,
                cedula: usuario.Cedula,
                quorum: usuario.quorum,
                esRepresentado: usuario.esRepresentado
            }))
        });

    } catch (error) {
        console.error("Error al calcular el quórum total: ", error);
        return res.status(500).json({
            error: 'Hubo un error al calcular el quórum',
            detalles: error.message
        });
    }
};


exports.getUsuariosPresentesByPDF = async (req, res) => {
    try {
        const id_card = req.params.id_card;

        if (!id_card) {
            return res.status(400).json({
                message: "El id_card es obligatorio.",
            });
        }

        const usuariosPresentes = await ModelUser.findAll({
            where: {
                id_card: id_card,
                Asistencia: "Presente",
            },
            attributes: [
                "Nombre",
                "Apellido",
                "Cedula",
                "Asistencia",
                "quorum",
                "Representante",
                "HoraDellegada",
                "esRepresentado", // Incluir el nuevo campo
            ],
        });

        if (usuariosPresentes.length === 0) {
            return res.status(404).json({
                message: "No se encontraron usuarios presentes con ese id_card.",
            });
        }

        // Transformar los datos con la nueva lógica para "Asistencia"
        const usuariosConNombreCompleto = usuariosPresentes.map(usuario => ({
            NombreCompleto: `${usuario.Nombre} ${usuario.Apellido}`,
            Cedula: usuario.Cedula,
            Asistencia: usuario.esRepresentado === "P" ? "P" : "Presente", // Nueva condición
            quorum: usuario.quorum,
            HoraDellegada: usuario.HoraDellegada,
            Representante: usuario.Representante,
        }));

        const quorumsTotales = usuariosPresentes.reduce((total, usuario) => {
            return total + (parseFloat(usuario.quorum) || 0);
        }, 0);

        res.json({
            usuarios: usuariosConNombreCompleto,
            quorumsTotales,
        });
    } catch (error) {
        console.error("Hubo un error al obtener los usuarios presentes:", error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};






exports.getUserVotesByAssembly = async (req, res) => {
    try {
        const { id_card } = req.params; // ID de la asamblea

        // Buscar los usuarios presentes en la asamblea
        const users = await UsuariosDefinitive.findAll({
            where: { id_card, Asistencia: 'Presente' },
            attributes: ['Nombre', 'Apellido', 'Cedula', 'HoraDellegada', 'quorum'],
            include: [
                {
                    model: Votos,
                    as: 'votos',
                    attributes: ['voto'],
                    include: [
                        {
                            model: OptionsModel,
                            as: 'opcion',
                            attributes: [],
                            include: [
                                {
                                    model: QuestionsModel,
                                    as: 'pregunta',
                                    attributes: ['id', 'Pregunta'],
                                    where: { id_card },
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // Formatear los datos
        const result = users.map(user => {
            const votos = user.votos.reduce((acc, voto) => {
                const questionKey = `${voto.opcion.pregunta.Pregunta}-${voto.opcion.pregunta.id}`;
                acc[questionKey] = voto.voto;
                return acc;
            }, {});

            return {
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                Cedula: user.Cedula,
                HoraDellegada: user.HoraDellegada,
                quorum: user.quorum,
                Votos: votos,
            };
        });

        // Respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener los usuarios y votos:", error);
        res.status(500).json({ message: error.message });
    }
};



exports.getUsersAndVotesByExcel = async (req, res) => {
    try {
        const { id_card } = req.params; // ID de la asamblea

        // Obtener todas las preguntas de la asamblea
        const questions = await QuestionsModel.findAll({
            where: { id_card }, // Filtrar por el id de la asamblea
            attributes: ['id', 'Pregunta'], // Solo necesitamos el ID y el texto de la pregunta
        });

        // Verificar preguntas
        console.log('Preguntas:', questions.length);

        // Buscar los usuarios presentes en la asamblea
        const users = await UsuariosDefinitive.findAll({
            where: { id_card, Asistencia: 'Presente' },
            attributes: ['Nombre', 'Apellido', 'Cedula', 'HoraDellegada', 'quorum'],
        });

        console.log('Usuarios encontrados:', users.length);
        console.log('Usuarios encontrados:', users.map(user => user.Nombre));

        // Obtener los votos de cada usuario (sin relaciones)
        const votes = await Votos.findAll({
            where: { id_voter: users.map(user => user.Cedula) },
            include: [
                {
                    model: OptionsModel,
                    as: 'opcion', // Alias para las opciones de voto
                    include: [
                        {
                            model: QuestionsModel,
                            as: 'pregunta' // Alias para las preguntas
                        }
                    ]
                }
            ]
        });

        // Formatear los datos
        const result = users.map(user => {
            // Crear un objeto para almacenar los votos
            const formattedVotes = {};
        
            // Inicializar con todas las preguntas, asignando null por defecto
            questions.forEach((question, index) => {
                const questionKey = `Pregunta-${index + 1}`; // Formato "Pregunta-1", "Pregunta-2", ...
                formattedVotes[questionKey] = null; // Inicializamos en null
            });
        
            // Asignar los votos de cada usuario si existen
            votes.forEach(voto => {
                if (voto.id_voter === user.Cedula) {
                    const questionIndex = questions.findIndex(
                        question => question.id === voto.opcion.pregunta.id
                    );
                    if (questionIndex !== -1) {
                        const questionKey = `Pregunta-${questionIndex + 1}`;
                        formattedVotes[questionKey] = voto.voto; // Asignar el voto si existe
                    }
                } 
            }); 
        
            return {   
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                Cedula: user.Cedula,
                HoraDellegada: user.HoraDellegada,
                quorum: user.quorum,
                ...formattedVotes, // Agregar los votos como columnas separadas
            };
        }); 

        // Respuesta
        res.json(result);
    } catch (error) {
        console.error("Error al obtener los usuarios y votos:", error);
        res.status(500).json({ message: error.message });
    }
};
     


exports.getAllUsersOperaddor = async (req, res) => {
    try {
        // Obtener el id_card desde los parámetros de la solicitud
        const idCard = req.params.id_card;

        // Verificar que se recibió el id_card
        if (!idCard) {
            return res.status(400).json({
                message: "El ID de la tarjeta (id_card) es obligatorio.",
            });
        }

        // Obtener los usuarios que coincidan con el id_card y tengan esRepresentado = "No"
        const users = await ModelUser.findAll({
            attributes: [
                [Sequelize.fn('CONCAT', Sequelize.col('Nombre'), ' ', Sequelize.col('Apellido')), 'Nombre'],
                'Apto',
                'quorum',
                'id',
            ],
            where: {
                id_card: idCard, // Filtrar por id_card
                esRepresentado: "No" // Filtrar por esRepresentado = "No"
            }
        });

        // Enviar la respuesta con los usuarios encontrados
        res.json(users);
    } catch (error) {
        console.error("Hubo un error al traer los usuarios:", error.message);
        res.status(500).json({
            message: "Hubo un error al traer los usuarios.",
            errorDetails: error.message
        });
    }
};


exports.updateUserQuorumAndAsistencia = async (req, res) => {
    const { idcard, cedula, quorumAAgregar, PoderesDelegados, Usuarios, Representante } = req.body;

    try {
        // Validar quorumAAgregar
        if (isNaN(quorumAAgregar)) {
            return res.status(400).json({ message: "El valor de quorumAAgregar debe ser un número." });
        }

        // Validar PoderesDelegados
        if (PoderesDelegados === null || PoderesDelegados === undefined) {
            return res.status(400).json({ message: "El valor de PoderesDelegados es requerido." });
        }

        // Validar que Usuarios sea un array
        if (!Array.isArray(Usuarios)) {
            return res.status(400).json({ message: "El parámetro 'Usuarios' debe ser un array de objetos." });
        }

        // Actualizar quorum para el usuario especificado
        const user = await ModelUser.findOne({ where: { Cedula: cedula, id_card: idcard } });

        if (!user) {
            return res.status(404).json({ message: `No se encontró ningún usuario con la cédula ${cedula} bajo el idcard ${idcard}.` });
        }

        const quorumActual = parseFloat(user.quorum || 0);
        const nuevoQuorum = quorumActual + parseFloat(quorumAAgregar);

        user.quorum = nuevoQuorum;
        user.PoderesDelegados = PoderesDelegados;
        user.Apoderados = Usuarios; // Guardar el JSON en el campo Apoderados
        await user.save();

        // Actualizar Asistencia para los usuarios en el array
        const cédulasAActualizar = Usuarios.map(usuario => usuario.id);

        const [rowsAffected] = await ModelUser.update(
            { 
                Asistencia: "Presente",
                esRepresentado: "P",
                Representante: Representante 
            },
            {
                where: {
                    id: cédulasAActualizar,
                    id_card: idcard,
                },
            }
        );

        // Respuesta con detalles de las operaciones
        res.status(200).json({
            message: "El quorum, PoderesDelegados, Asistencia y Apoderados se actualizaron correctamente.",
            quorumActualizado: {
                Cedula: user.Cedula,
                Nombre: user.Nombre,
                Apellido: user.Apellido,
                NuevoQuorum: user.quorum,
                PoderesDelegados: user.PoderesDelegados,
                Apoderados: user.Apoderados,
            },
            asistenciaActualizada: rowsAffected, // Número de filas afectadas por la actualización de Asistencia
        });
    } catch (error) {
        console.error("Error al actualizar el quorum, asistencia y apoderados:", error);
        res.status(500).json({
            message: "Hubo un error al intentar actualizar el quorum, los poderes delegados, la asistencia y los apoderados.",
            errorDetails: error.message,
        });
    }
};





exports.createUserApoderado = async (req, res) => {
    try {
        const { Cedula, Nombre, Apellido, id_card, usuarios } = req.body;

        // Validar que los campos obligatorios estén presentes
        if (!Cedula || !Nombre || !Apellido || !id_card) {
            return res.status(400).json({
                message: "Los campos Cedula, Nombre, Apellido e id_card son obligatorios.",
            });
        }

        // Validar que usuarios sea un array, si está presente
        if (usuarios && !Array.isArray(usuarios)) {
            return res.status(400).json({
                message: "El campo usuarios debe ser un array.",
            });
        }

        // Calcular la suma de los valores de la clave 'quorum' en el array usuarios
        let totalQuorum = 0;
        if (usuarios && usuarios.length > 0) {
            totalQuorum = usuarios.reduce((sum, usuario) => {
                const quorumValue = parseFloat(usuario.quorum);
                return sum + (isNaN(quorumValue) ? 0 : quorumValue);
            }, 0);
        }

        // Verificar si ya existe un usuario con la misma cédula
        const existingUser = await ModelUser.findOne({ where: { Cedula } });
        if (existingUser) {
            return res.status(210).json({
                message: `Ya existe un usuario registrado con la cédula ${Cedula}.`,
            });
        }

        // Actualizar los usuarios en la lista con los nuevos valores
        if (usuarios && usuarios.length > 0) {
            const currentDateTime = new Date(); // Obtener la fecha y hora actual
            const formattedDateTime = currentDateTime.toISOString(); // Convertir a string en formato ISO

            for (const usuario of usuarios) {
                // Validar que los campos Cedula e id_card estén presentes
                if (!usuario.id) {
                    console.warn(
                        `El usuario con datos incompletos fue omitido: ${JSON.stringify(usuario)}`
                    );
                    continue;
                }

                try {
                    // Actualizar campos específicos en la base de datos
                    await ModelUser.update(
                        {
                            esRepresentado: "P",
                            Asistencia: "Presente",
                            HoraDellegada: formattedDateTime, // Pasar la fecha y hora como string
                        },
                        {
                            where: {
                                id: usuario.id,
                                id_card: id_card,
                            },
                        }
                    );
                } catch (updateError) {
                    console.error(
                        `Error al actualizar el usuario con ID ${usuario.id}:`,
                        updateError.message
                    );
                }
            }
        }

        // Crear el usuario apoderado con el quorum calculado
        const newUser = await ModelUser.create({
            ...req.body,
            quorum: totalQuorum,
        });
  
        // Responder con el usuario creado
        res.status(201).json({
            message: "El registro fue exitoso.",
            user: {
                Cedula: newUser.Cedula,
                Nombre: newUser.Nombre,
                Apellido: newUser.Apellido,
                id_card: newUser.id_card,
                quorum: newUser.quorum,
            },
        });
    } catch (error) {
        console.error("Error al crear el usuario:", error.message);
        res.status(500).json({
            message: "Ocurrió un error al intentar crear el usuario.",
            errorDetails: error.message,
        });
    }
};
 