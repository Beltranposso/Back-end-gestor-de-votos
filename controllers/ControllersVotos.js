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

 exports.getvoto = async (req, res) => {
    try {
        const votos = await Votos.findAll({
            where: { id_card: req.params.id_card },
            include: [
                {
                    model: UsuariosDefinitive,
                    as: 'usuarios', // Usar el alias definido en la relación
                    attributes: ['Nombre'], // Seleccionar los campos que necesitas
                }
            ]
        });
        res.json(votos);
    } catch (error) {
        console.log("Hubo un error al traer los votos");
        res.json({
            "message": error.message
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
