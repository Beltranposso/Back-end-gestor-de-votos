const Usermodel = require('../models/UsersModel.js');
const cache = require('memory-cache');
const jwt = require('jsonwebtoken'); 

// const dotenv = require('dotenv'); // Si es necesario, puedes descomentar esta línea


// Métodos para el CRUD

// Este método muestra todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const Users = await Usermodel.findAll();
        res.json(Users);
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
        const user = await Usermodel.findAll({
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


exports.getUserONE = async (req, res) => {
    console.log(req.params.id);
    try {
        const userId = req.params.id;
        const cacheKey = `user_${userId}`;  // Clave única para este usuario

        // 1. Intentamos obtener el usuario desde el caché
        const cachedUser = cache.get(cacheKey);

        if (cachedUser) {
            // Si encontramos el usuario en caché, lo retornamos
            console.log("Datos obtenidos desde el caché");
            return res.json(cachedUser);
        }

        // 2. Si no está en caché, lo obtenemos de la base de datos
        const user = await Usermodel.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.json({
                message: "Usuario no encontrado",
                id: userId
            });
        }

        // 3. Guardamos los datos en caché por 10 minutos (600000 ms)
        cache.put(cacheKey, user, 600000);  // 10 minutos de caché
        console.log("Datos obtenidos de la base de datos");

        // 4. Retornamos el usuario
        res.json(user);

    } catch (error) {
        console.log("Hubo un error al buscar el usuario");
        res.json({
            message: error.message
        });
    }
};


exports.getUserOperador = async (req, res) => {
    try {
        const user = await Usermodel.findAll({
            where: { 
                id_card: req.params.id_card, 
                cargo: 2 
            } 
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


exports.getUserCordinador = async (req, res) => {
    try {
        const user = await Usermodel.findAll({
            where: { 
                id_card: req.params.id_card, 
                cargo: 3 
            }
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
        const { Cedula, Nombre, Apellido, Correo, Contraseña, cargo, id_card } = req.body;

        // Verificar que todos los campos requeridos están presentes
        if (!Cedula || !Nombre || !Apellido || !Correo || !Contraseña) {
            return res.status(400).json({
                message: "Todos los campos obligatorios deben ser completados.",
            });
        }

        // Verificar si la cédula ya está registrada
        const existingUser = await Usermodel.findOne({ where: { Cedula } });
        if (existingUser) {
            return res.status(250).json({
                message: "La cédula ya está registrada. Por favor, use una diferente.",
            });
        }

        // Crear el nuevo usuario
        const newUser = await Usermodel.create({
            Cedula,
            Nombre,
            Apellido,
            Correo,
            Contraseña,
            cargo,
            id_card,
        });

        res.status(201).json({
            message: "El registro fue exitoso.",
            data: newUser, // Devolver información del usuario creado
        });
    } catch (error) {
        console.error("Error al registrar el usuario:", error.message);
        res.status(500).json({
            message: "Hubo un error al registrar el usuario.",
            error: error.message,
        });
    }
};


// Este método actualiza la información de un usuario
exports.updateUser = async (req, res) => {

    console.log(req.body);
    try {
        const user = await Usermodel.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: `Usuario con ID ${req.params.id} no encontrado` });
        }

        const updatedUser = await user.update(req.body);
        res.json({ message: "Usuario actualizado correctamente", data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
    }
};

// Este método elimina a un usuario 
exports.DeleteUser = async (req, res) => {
    try {
        await Usermodel.destroy({
            where: { Cedula: req.params.Cedula }
        });
    } catch (error) {
        res.json({
            "message": error.message
        }); 
    }
};exports.SetAsistencia = async (req, res) => {
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
        const user = await Usermodel.findOne({ where: { Cedula: cedula } });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        // Determinar el nuevo valor para el campo "Asistencia"
        let nuevaAsistencia;
        if (user.Asistencia === "Presente") {
            nuevaAsistencia = "Ausente"; // Cambiar de "Presente" a "Ausente"
        } else {
            nuevaAsistencia = "Presente"; // Cambiar de "Ausente" o null a "Presente"
        }

        // Actualizar el campo "Asistencia" del usuario encontrado
        await Usermodel.update(
            { Asistencia: nuevaAsistencia }, // Datos a actualizar
            { where: { Cedula: cedula } } // Condición de búsqueda
        );

        // Enviar respuesta con el nuevo estado de la asistencia
        res.json({
            message: `La asistencia del Operador se actualizó correctamente a "${nuevaAsistencia}".`,
        });
    } catch (error) {
        console.log("Hubo un error al actualizar la asistencia del usuario:", error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};
 

exports.getColumnByCedula = async (req, res) => {
    try {
        // Obtén el token desde las cookies
        const token = req.cookies.auth_token; // Asegúrate de que la cookie se llama 'token'

        if (!token) {
            return res.status(401).json({
                message: "Token no proporcionado",
                data: null,
            });
        } 

        // Decodifica el token usando tu clave secreta
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Cambia `JWT_SECRET` por tu clave secreta

        // Obtén la cédula desde el token
        const cedula = decoded.Cedula; // Asegúrate de que el token tiene un campo `Cedula`

        if (!cedula) {
            return res.status(400).json({
                message: "El token no contiene una cédula válida",
                data: null,
            });
        }

        // Busca en la base de datos usando la cédula
        const user = await Usermodel.findOne({
            where: { Cedula: cedula },
            attributes: ['Asistencia'], // Cambia 'column_name' por el nombre de la columna que deseas obtener
        });

        if (!user) {
            return res.status(404).json({
                message: "No se encontró ningún usuario con la cédula proporcionada",
                data: null,
            });
        }

        // Responde con el valor de la columna
        res.json({
            message: "Valor obtenido exitosamente",
            data: user.Asistencia, // Cambia 'column_name' por el nombre de la columna que deseas devolver
        });
    } catch (error) {
        console.error("Hubo un error al procesar la solicitud:", error.message);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};





exports.verifyUserByToken = async (req, res) => {
    try {
        // Obtener el token de las cookies
        const token = req.cookies.auth_token;

        // Verificar si el token existe
        if (!token) {
            return res.status(401).json({
                message: "Token no encontrado. Acceso denegado.",
                verified: false
            });
        }

        // Decodificar el token para obtener la cédula
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY); // Cambia 'TU_SECRETO_AQUI' por tu clave secreta
        } catch (error) {
            return res.status(401).json({
                message: "Token inválido o expirado.",
                verified: false
            });
        }

        const userCedula = decoded.Cedula; // Asegúrate de que el token incluya este campo
        const idCard = req.params.id_card; // Obtener el id_card de los parámetros de la ruta

        // Buscar usuarios asociados al id_card
        const users = await Usuarios.findAll({
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
        const userExists = users.some(user => user.Cedula === userCedula);

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
        console.error("Error al verificar el usuario por token:", error.message);
        res.status(500).json({
            message: "Error interno del servidor.",
            error: error.message
        });
    }
};
exports.getCargo = async (req, res) => {
    try {
        // Depuración: Imprimir el token recibido
        console.log('Token recibido:', req.cookies.auth_token);

        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        // Depuración: Verificar decodificación del token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('Token decodificado:', decoded);
        } catch (tokenError) {
            console.error('Error al verificar el token:', tokenError.message);
            return res.status(401).json({ message: 'Token inválido' });
        }

        const Cedula = parseInt(decoded.Cedula, 10);
        if (isNaN(Cedula)) {
            return res.status(400).json({ message: 'Cédula en el token no válida' });
        }

        // Depuración: Imprimir la cédula buscada
        console.log('Buscando usuario con cédula:', Cedula);

        const user = await Usermodel.findOne({ where: { Cedula } });
        
        // Depuración: Imprimir el usuario encontrado
        console.log('Usuario encontrado:', user);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const cargos = {
            1: 'Administrador',
            2: 'Operador de registro',
            3: 'Coordinador'
        };

        // Depuración: Imprimir el valor de cargo
        console.log('Valor de cargo:', user.cargo);

        const userCargo = cargos[user.cargo];
        
        // Depuración: Imprimir el cargo mapeado
        console.log('Cargo mapeado:', userCargo);

        if (!userCargo) {
            return res.status(403).json({ message: 'Cargo no autorizado' });
        }

        return res.status(200).json({
            Cargo: userCargo
        });

    } catch (error) {
        console.error('Error al obtener el cargo:', error.message);
        return res.status(500).json({ message: 'Error en el servidor. Por favor intenta de nuevo más tarde.' });
    }
};






// /* export const Login = async (req, res) => {
//     try {
//         const { Cedula, Contraseña } = req.body; // Captura los datos enviados en la solicitud
//         const user = await Usermodel.findOne({ where: { Cedula } });
//
//         if (!user) {
//             return res.status(401).json({ message: 'Cedula inválida' });
//         }
//
//         // Comparación directa sin usar bcrypt ni seguridad adicional
//         if (Contraseña !== user.Contraseña) {
//             return res.status(401).json({ message: 'Contraseña inválida' });
//         }
//
//         return res.json({ message: 'Inicio de sesión exitoso', user });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }; */
// dotenv.config(); // Si es necesario, puedes descomentar esta línea
// /* export const login = async (req, res) => {
//     
//     const secretKey = process.env.SECRET_KEY;
//     
//     try {
//         if (!secretKey) {         
//             throw new Error('SECRET_KEY is not defined in .env file');
//         }
//         const { Cedula, Contraseña } = req.body;
//         const user = await Usermodel.findOne({ where: { Cedula } });
//
//         if (!user || Contraseña !== user.Contraseña) {
//             return res.status(401).json({ message: 'Cedula o Contraseña incorrectos' });
//         }
//
//         // Generar el token
//         const token = jwt.sign({ Cedula: user.Cedula }, secretKey, { expiresIn: '1h' });
//
//         // Responder con el token
//         return res.json({ token });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }
// */

