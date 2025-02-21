const VotosMode = require("../models/VotosMode.js");

const ModelUser = require('../models/UsuariosModelD.js');
const { Votos, UsuariosDefinitive,QuestionsModel,OptionsModel } = require("../models/asociations.js");
const jwt = require('jsonwebtoken'); 
// Trae todos los votos
exports.getAllVotos = async (req, res) => {
    try {
        const Votos = await VotosMode.findAll();
        res.json(Votos);

    } catch (error) {
        console.log("Hubo un error al traer los votos de los usuarios");
        res.json({
            "message": error.message
        });
    }
};
 
// Registra un voto

exports.RegisterVote = async (req, res) => {
    try {
      // Obtener el token desde las cookies o encabezados
      const token = req.cookies.Token;
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
      }
  
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const id_voter = parseInt(decoded.Cedula); // Extraer la cédula del token

      // Obtener el arreglo de votos
      const { votos } = req.body;
  
      if (!votos || !Array.isArray(votos)) {
        return res.status(400).json({ message: "Formato de votos incorrecto." });
      }
  
      console.log("Votos recibidos:", votos);
  
      // Agregar id_voter (cédula) a cada voto
      const votosProcesados = votos.flatMap((pregunta) =>
        pregunta.opciones.map((opcion) => ({
            id_option: opcion.id_option,
            voto: opcion.voto,
            id_card: opcion.id_card,
            id_voter: id_voter,
            id_question: opcion.preguntaId
        }))
    );
  
      console.log("Votos procesados con id_voter:", votosProcesados);
  
      // Insertar todos los votos en la base de datos utilizando Sequelize
      await Promise.all(
        votosProcesados.map(async (voto) => {
          // Asegúrate de que el voto contiene tanto la opción (id_option) como la pregunta (preguntaId)
          await VotosMode.create({
            id_option: voto.id_option, // Opción seleccionada
            id_voter:id_voter, // Cédula del votante
            voto: voto.voto, // El voto ("si" o "no")
            id_card: voto.id_card, // ID del votante (tarjeta o usuario)
            id_question:voto.id_question  // ID de la pregunta
          });
        })
      );
  
      // Actualizar el campo EstadoVoto del usuario en la base de datos
      await ModelUser.update(
        { EstadoVoto: "si" }, // Actualización del estado
        { where: { Cedula: id_voter } } // Condición para identificar al usuario
      );
  
      res.status(201).json({ message: "Votos procesados y guardados correctamente." });
    } catch (error) {
      console.error("Error al procesar los votos:", error.message);
      res.status(500).json({ message: "Error al procesar los votos." });
    }
  };
  
  
 // Asegúrate de importar el modelo de Usuarios


 /* modificar */
 exports.getvoto = async (req, res) => {
    try {
        // Obtener los votos filtrando por id_card
        const votos = await Votos.findAll({
            where: { id_card: req.params.id_card },
            attributes: ['id_option', 'id_voter', 'voto', 'id_card', 'id_question'], // Ajusta según lo necesario
        });

        if (votos.length === 0) {
            return res.json({ message: "No se encontraron votos para el id_card proporcionado." });
        }

        // Obtener los usuarios asociados a este id_card
        const usuarios = await ModelUser.findAll({
            where: { id_card: req.params.id_card },
            attributes: ['Nombre', 'Apellido', 'Cedula'], // Ajusta según lo que necesites
        });

        if (usuarios.length === 0) {
            return res.json({ message: "No se encontraron usuarios asociados al id_card proporcionado." });
        }

        // Combinar la información de votos y usuarios manualmente
        const resultado = votos.map((voto) => {
            return {
                ...voto.dataValues, // Incluye todos los campos del voto
                usuarios: usuarios.map((usuario) => ({
                    Nombre: usuario.Nombre,
                    Apellido: usuario.Apellido,
                    Cedula: usuario.Cedula,
                })),
            };
        });

        // Devolver la información combinada
        res.json(resultado);
    } catch (error) {
        console.error("Hubo un error al traer los votos:", error.message);
        res.status(500).json({
            message: "Error al obtener los datos",
        });
    }
};

// Obtiene los votos por id de opción
exports.getVotosByid = async (req, res) => {
    try {
        const votos = await VotosMode.findAll({
            where: { id_Option: req.params.id_Option }
        });
        res.json(votos);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};



exports.checkVoter = async (req, res) => {
    try {
        // Obtener el token desde las cookies (ajusta esto si usas otro mecanismo de almacenamiento)
        const token = req.cookies.Token;

        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        // Decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Usa tu clave secreta aquí
        const cedula = parseInt(decoded.Cedula); // Ajusta según el campo que almacene la cédula

        // Verificar si la cédula existe en el campo "id_voter"
        const votoExistente = await VotosMode.findOne({
            where: { id_voter: cedula }
        });

        if (votoExistente) {
            // Si existe, devolver false
            return res.json({ messege: 'El usuario ya ha votado tumba la casa mami', exists: false });
        } else {
            // Si no existe, devolver true
            return res.json({messege: 'El usuario no ha votado', exists: true });
        }
 
    } catch (error) {
        console.error('Error en la verificación del votante:', error);
        res.status(500).json({ message: error.message });
    }
};


 // Asegúrate de tener los modelos correctos importados

exports.obtenerResultadosPorCard = async (req, res) => {
    try {
        const idCard = req.params.idCard;  // Obtenemos el id_card desde los parámetros de la URL

        // Paso 1: Obtener todas las preguntas relacionadas con el id_card
        const preguntas = await QuestionsModel.findAll({
            where: { id_card: idCard },  // Filtrar por el id_card
            include: [
                {
                    model: OptionsModel,   // Incluir las opciones relacionadas con la pregunta
                    as: 'opciones',  // Alias de las opciones (ajusta si es necesario)
                },
            ],
        });

        if (!preguntas || preguntas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron preguntas para este id_card' });
        }

        // Paso 2: Preparar el resultado para cada pregunta
        const resultados = [];

        for (const pregunta of preguntas) {
            const totalVotos = await Votos.count({
                where: { id_question: pregunta.id },  // Contamos los votos para esta pregunta
            });

            // Paso 3: Obtener los votos por opción
            const votosPorOpcion = {};
            const opciones = pregunta.opciones;  // Las opciones asociadas a la pregunta

            opciones.forEach(opcion => {
                votosPorOpcion[opcion.opcion] = 0;  // Inicializamos el contador de votos por opción
            });

            // Contamos los votos por opción
            const votos = await Votos.findAll({
                where: { id_question: pregunta.id },
            });

            votos.forEach(voto => {
                const opcionSeleccionada = voto.voto;  // Asegúrate de que 'voto' esté mapeado correctamente
                if (votosPorOpcion[opcionSeleccionada] !== undefined) {
                    votosPorOpcion[opcionSeleccionada]++;
                }
            });

            // Paso 4: Calcular los porcentajes
            const porcentajes = {};
            opciones.forEach(opcion => {
                const votosOpcion = votosPorOpcion[opcion.opcion];
                const porcentaje = totalVotos > 0 ? (votosOpcion / totalVotos) * 100 : 0;
                porcentajes[opcion.opcion] = porcentaje.toFixed(2);  // Dos decimales
            });

            // Paso 5: Almacenar el desglose de cada pregunta
            resultados.push({
                pregunta: pregunta.Pregunta,   // Suponiendo que 'Pregunta' es el campo con la pregunta
                totalVotos,
                opciones: opciones.map(opcion => ({
                    opcion: opcion.opcion,
                    votos: votosPorOpcion[opcion.opcion],
                    porcentaje: porcentajes[opcion.opcion],
                })),
            });
        }

        // Paso 6: Devolver el desglose de todos los resultados
        res.json({ resultados });

    } catch (error) {
        console.error('Error al obtener los resultados de votación:', error);
        res.status(500).json({ message: 'Error en la obtención de resultados', error: error.message });
    }
};


exports.obtenerResultadosPorCardxCoeficiente = async (req, res) => {
    try {
        const idCard = req.params.idCard;  // Obtenemos el id_card desde los parámetros de la URL

        // Paso 1: Obtener todas las preguntas relacionadas con el id_card
        const preguntas = await QuestionsModel.findAll({
            where: { id_card: idCard },  
        });

        if (!preguntas || preguntas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron preguntas para este id_card' });
        }

        // Paso 2: Preparar el resultado para cada pregunta
        const resultados = [];

        for (const pregunta of preguntas) {
            // Obtener todas las opciones de la pregunta
            const opciones = await OptionsModel.findAll({
                where: { id_pregunta: pregunta.id },
            });

            // Obtener todos los votos de la pregunta
            const votos = await Votos.findAll({
                where: { id_question: pregunta.id },
            });

            // Obtener los quorums de los usuarios que votaron
            const usuariosQueVotaron = await ModelUser.findAll({
                where: { Cedula: votos.map(voto => voto.id_voter) },  // Filtramos solo los usuarios que votaron
                attributes: ['Cedula', 'quorum'],  // Solo necesitamos el id y el quorum
            });

            // Crear un mapa de quorums por usuario para facilitar el acceso
            const quorumPorUsuario = {};
            usuariosQueVotaron.forEach(usuario => {
                quorumPorUsuario[usuario.Cedula] = usuario.quorum;
            });

            // Calcular el total de quorum sumando los quorums de todos los usuarios que votaron
            const totalQuorum = votos.reduce((acc, voto) => acc + (quorumPorUsuario[voto.id_voter] || 0), 0);

            // Paso 3: Obtener la suma de quorums por opción
            const quorumsPorOpcion = {};
            opciones.forEach(opcion => {
                quorumsPorOpcion[opcion.opcion] = 0;  // Inicializamos el quorum por opción en 0
            });

            votos.forEach(voto => {
                const opcionSeleccionada = voto.voto;
                const quorumUsuario = quorumPorUsuario[voto.id_voter] || 0;

                if (quorumsPorOpcion[opcionSeleccionada] !== undefined) {
                    quorumsPorOpcion[opcionSeleccionada] += quorumUsuario;
                }
            });

            // Paso 4: Calcular los porcentajes basados en el quorum total
            const porcentajes = {};
            opciones.forEach(opcion => {
                const quorumOpcion = quorumsPorOpcion[opcion.opcion];
                const porcentaje = totalQuorum > 0 ? (quorumOpcion / totalQuorum) * 100 : 0;
                porcentajes[opcion.opcion] = porcentaje.toFixed(2);
            });

            // Paso 5: Almacenar el desglose de cada pregunta
            resultados.push({
                pregunta: pregunta.Pregunta,
                totalVotos: votos.length,
                totalquorum: totalQuorum.toFixed(4),  // Redondear a 4 decimales
                opciones: opciones.map(opcion => ({
                    opcion: opcion.opcion,
                    votos: quorumsPorOpcion[opcion.opcion].toFixed(4),  // Mostrar quorum sumado por opción
                    porcentaje: porcentajes[opcion.opcion],  // Basado en quorum
                })),
            });
        }

        // Paso 6: Devolver el desglose de todos los resultados
        res.json({ resultados });

    } catch (error) {
        console.error('Error al obtener los resultados de votación:', error);
        res.status(500).json({ message: 'Error en la obtención de resultados', error: error.message });
    }
};

exports.getOpcionesConQuorumByPregunta = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la pregunta desde los parámetros de la ruta
        console.log(id);
        // Obtener las opciones asociadas a la pregunta
        const opciones = await OptionsModel.findAll({
            where: { id }, // Filtrar por el id_pregunta
            attributes: ['id', 'opcion'] // Traer solo los campos necesarios
        });

        // Crear un arreglo para almacenar las opciones con sus totales de quorum
        const opcionesConQuorum = [];

        for (const opcion of opciones) {
            // Obtener los votos de la opción actual
            const votos = await Votos.findAll({
                where: { id_Option: opcion.id },
                attributes: ['id_voter'] // Traer solo el ID del votante
            });

            // Calcular la suma de quorums
            let totalQuorum = 0;
            for (const voto of votos) {
                // Buscar el usuario correspondiente al voto
                const usuario = await UsuariosDefinitive.findOne({
                    where: { Cedula: voto.id_voter },
                    attributes: ['quorum'] // Traer solo el campo quorum
                });

                // Sumar el quorum del usuario (si existe)
                if (usuario) {
                    totalQuorum += usuario.quorum;
                }
            }

            // Agregar la opción y su total de quorum al arreglo
            opcionesConQuorum.push({
                opcion: opcion.opcion,
                totalQuorum
            });
        }

        // Responder con las opciones y sus totales de quorums
        res.json(opcionesConQuorum);
    } catch (error) {
        res.status(500).json({
            message: `Error al obtener las opciones: ${error.message}`
        });
    }
};




exports.getProcessedDataByPregunta = async (req, res) => {
    try {
        const { id_card,IdPregunta } = req.params; // Asumimos que los parámetros son id_card y IdPregunta
       
        // Obtener la pregunta específica con el IdPregunta
        if (!IdPregunta) {
            return res.status(400).json({ message: "IdPregunta es requerido en el cuerpo de la solicitud" });
        }
        console.log("id card",id_card);
        console.log("idf pregunta",IdPregunta);
        const pregunta = await QuestionsModel.findOne({
            where: { id: IdPregunta, id_card }, // Filtrar por IdPregunta y id_card
            include: [
                {
                    model: OptionsModel,
                    as: 'opciones', 
                    include: [
                        {
                            model: Votos,
                            as: 'votos',
                        },
                    ],
                },
            ],
        });

        if (!pregunta) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        // Obtener los usuarios asociados a la asamblea
        const usuarios = await UsuariosDefinitive.findAll({
            where: { id_card },
        });

        // Crear un mapa de quórum por usuario
        const userPowerMap = new Map(
            usuarios.map((usuario) => [usuario.Cedula, usuario.quorum])
        );

        // Arreglos para almacenar las opciones y los votos ponderados
        const opciones = [];
        const votos = [];

        // Procesar las opciones y votos
        pregunta.opciones.forEach((opcion) => {
            // Calcular los votos ponderados para cada opción
            const votosPonderados = opcion.votos.reduce((total, voto) => {
                const userPower = userPowerMap.get(voto.id_voter) || 0;
                return total + userPower;
            }, 0);

            // Agregar la opción y los votos ponderados a los arreglos
            opciones.push(opcion.opcion);
            votos.push(votosPonderados);
        });

        // Crear el resultado en el formato solicitado
        const result = {
            id_pregunta: pregunta.id,
            texto_pregunta: pregunta.Pregunta,
            opciones: opciones,
            Votos: votos,
        };

        res.json(result);
    } catch (error) {
        console.error("Hubo un error al procesar los datos:", error);
        res.status(500).json({ message: error.message });
    }
};




exports.getProcessedDataLengthByPregunta = async (req, res) => {
    try {
        const { id_card, IdPregunta } = req.params; // Asumimos que los parámetros son id_card y IdPregunta

        // Validar que IdPregunta esté presente
        if (!IdPregunta) {
            return res.status(400).json({ message: "IdPregunta es requerido en el cuerpo de la solicitud" });
        }

        console.log("id card", id_card);
        console.log("id pregunta", IdPregunta);

        // Obtener la pregunta específica con el IdPregunta
        const pregunta = await QuestionsModel.findOne({
            where: { id: IdPregunta, id_card }, // Filtrar por IdPregunta y id_card
            include: [
                {
                    model: OptionsModel,
                    as: 'opciones',
                    include: [
                        {
                            model: Votos,
                            as: 'votos',
                        },
                    ],
                },
            ],
        });

        if (!pregunta) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        // Arreglos para almacenar las opciones y el número de votos por opción
        const opciones = [];
        const votos = [];

        // Procesar las opciones y contar los votos
        pregunta.opciones.forEach((opcion) => {
            // Contar el número de votos para cada opción
            const numeroDeVotos = opcion.votos.length;

            // Agregar la opción y el número de votos a los arreglos
            opciones.push(opcion.opcion);
            votos.push(numeroDeVotos);
        });

        // Crear el resultado en el formato solicitado
        const result = {
            id_pregunta: pregunta.id,
            texto_pregunta: pregunta.Pregunta,
            opciones: opciones,
            Votos: votos,
        };

        res.json(result);
    } catch (error) {
        console.error("Hubo un error al procesar los datos:", error);
        res.status(500).json({ message: error.message });
    }
};