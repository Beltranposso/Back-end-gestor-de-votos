const ModelUser = require('../models/UsuariosModelD.js');
const VotesModel = require('../models/VotosMode.js');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


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
        const Users = await ModelUser.findAll();
        res.status(200).json({ count: Users.length });
    } catch (error) {
        console.log("Hubo un error al traer los usuarios");
        res.json({
            "message": error.message
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
    try {
        await ModelUser.update(req.body, {
            where: { Cedula: req.params.Cedula }
        });
        res.json({
            "message": "Se actualizó correctamente la información"
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Este método elimina a un usuario 
exports.DeleteUser = async (req, res) => {
    try {
        await ModelUser.destroy({
            where: { Cedula: req.params.Cedula }
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};
exports.getVotosByCardIdAndEstado = async (req, res) => {
    try {
        const votos = await ModelUser.findAll({
            where: {
                id_card: req.params.id_card, // Filtra por id_card
                EstadoVoto: "No"            // Solo donde EstadoVoto sea "No"
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

        // Verificar que se recibió la cédula
        if (!cedula) {
            return res.status(400).json({
                message: "La cédula del usuario es obligatoria.",
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

        // Actualizar solo el campo Asistencia del usuario encontrado
        await ModelUser.update(
            { Asistencia: "Presente" }, // Datos a actualizar
            { where: { Cedula: cedula } } // Condición de búsqueda
        );

        // Opcional: Buscar nuevamente al usuario actualizado para confirmarlo
        const updatedUser = await ModelUser.findOne({ where: { Cedula: cedula } });

        // Enviar respuesta con el usuario actualizado
        res.json({
            message: "La asistencia del usuario se actualizó correctamente."
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
        const { Cedula } = req.body; // Obtener la cédula del cuerpo de la solicitud
        const idCard = req.params.id_card; // Obtener el id_card desde los parámetros de la ruta

        // Verificar si la cédula y el id_card están presentes
        if (!Cedula) {
            return res.status(400).json({
                message: "Cédula no proporcionada.",
                success: false
            });
        }

        if (!idCard) {
            return res.status(400).json({
                message: "ID de la tarjeta (id_card) no proporcionado.",
                success: false
            });
        }

        // Verificar si el usuario está registrado bajo el id_card
        const user = await ModelUser.findOne({
            where: { Cedula, id_card: idCard }
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

        // Si la cédula está registrada bajo el id_card y no ha votado, generar un token
        const token = jwt.sign({ Cedula, id_card: idCard }, process.env.SECRET_KEY, {
            expiresIn: '9h' // Token temporal válido por 1 hora
        });

        // Establecer el token en las cookies
        res.cookie('Token', token, {
            httpOnly: true, // Aumenta la seguridad al evitar acceso desde JavaScript en el cliente
            secure: false, // Usar cookies seguras en producción
            maxAge: 3600000,
            sameSite: 'lax', // 'strict' o 'lax' según sea necesario
            path: '/', // Tiempo de expiración en milisegundos (1 hora)
        });

        return res.json({
            message: "El usuario está registrado bajo este id_card y no ha votado.",
            success: true,
            token // Devolver el token también en la respuesta, opcional
        });

    } catch (error) {
        console.error("Error al verificar el estado de votación:", error.message);
        res.status(500).json({
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

        // Obtener todos los usuarios presentes con el id_card especificado
        const usuariosPresentes = await ModelUser.findAll({
            where: {
                Asistencia: 'Presente',
                id_card: idCard
            },
            attributes: ['Nombre', 'Cedula', 'quorum']
        });

        // Obtener todos los usuarios registrados con el id_card (sin filtrar por presencia)
        const usuariosRegistrados = await ModelUser.findAll({
            where: { id_card: idCard },
            attributes: ['Nombre', 'Cedula', 'Asistencia', 'quorum']
        });

        const totalUsuariosRegistrados = usuariosRegistrados.length;

        // Si no hay usuarios presentes
        if (usuariosPresentes.length === 0) {
            console.log(`No hay usuarios presentes con id_card ${idCard}`);
            return res.status(200).json({
                message: `No hay usuarios presentes. Se muestran todos los usuarios registrados para id_card ${idCard}`,
                quorumTotal: 0,
                numeroUsuariosPresentes: 0,
                totalUsuariosRegistrados,
                usuariosRegistrados: usuariosRegistrados.map(usuario => ({
                    nombre: usuario.Nombre,
                    cedula: usuario.Cedula,
                    asistencia: usuario.Asistencia,
                    quorum: usuario.quorum
                }))
            });
        }

        // Calcular la suma del quorum de los usuarios presentes
        const quorumTotal = usuariosPresentes.reduce((acc, usuario) => {
            const quorum = parseFloat(usuario.quorum) || 0;
            return acc + quorum;
        }, 0);

        // Número de usuarios presentes
        const numeroUsuariosPresentes = usuariosPresentes.length;

        // Detalles de usuarios presentes
        const detallesUsuariosPresentes = usuariosPresentes.map(usuario => ({
            nombre: usuario.Nombre,
            cedula: usuario.Cedula,
            quorum: usuario.quorum
        }));

        // Limitar el quorum total a 2 decimales
        const quorumTo = parseFloat(quorumTotal.toFixed(2));

        console.log(`Quorum total de la asamblea para id_card ${idCard}: ${quorumTo}`);

        // Responder con los datos calculados
        return res.status(200).json({
            message: `Quorum total para el id_card ${idCard}`,
            quorumTotal: quorumTo,
            numeroUsuariosPresentes,
            totalUsuariosRegistrados,
            usuariosPresentes: detallesUsuariosPresentes,
            usuariosRegistrados: usuariosRegistrados.map(usuario => ({
                nombre: usuario.Nombre,
                cedula: usuario.Cedula,
                asistencia: usuario.Asistencia,
                quorum: usuario.quorum
            }))
        }); 

    } catch (error) {
        console.error("Error al calcular el quorum total: ", error);
        return res.status(500).json({
            error: 'Hubo un error al calcular el quorum',
            detalles: error.message
        });
    }
};
