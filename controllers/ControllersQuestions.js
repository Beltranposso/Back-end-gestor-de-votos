const QuestionModel = require('../models/QuestionsModel.js');

// Obtener preguntas por id de la tarjeta
exports.getQuestions = async (req, res) => {
    try {
        const Question = await QuestionModel.findAll({
            where: { id_card: req.params.id_card }
        });
        res.json(Question);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};



exports.hasQuestions = async (req, res) => {
    try {
        // Validar el parámetro id (debe ser una cadena no vacía)
        const id = req.params.id;
  

        // Buscar si existen preguntas asociadas a la tarjeta
        const hasQuestions = await QuestionModel.findOne({
            where: { id_card: id } // cardId debe ser el campo que relaciona preguntas con la tarjeta
        });

        // Responder si hay o no preguntas registradas
        if (hasQuestions) {
            return res.status(200).json({
                message: "La tarjeta tiene preguntas registradas.",
                hasQuestions: true
            });
        } else {
            return res.status(200).json({
                message: "La tarjeta no tiene preguntas registradas.",
                hasQuestions: false
            });
        }
    } catch (error) {
        // Log detallado del error para depuración
        console.error("Error al verificar si la tarjeta tiene preguntas registradas:", error.message);

        // Respuesta en caso de error del servidor
        res.status(500).json({
            message: "Hubo un error al verificar las preguntas asociadas a la tarjeta.",
            error: error.message
        });
    }
};






exports.getQuestionID = async (req, res) => {
    try {
        const Question = await QuestionModel.findAll({
            where: { id_card: req.params.id_card }
        });
        res.json(Question);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Crear una nueva pregunta
exports.createQuestion = async (req, res) => {
    try {
        await QuestionModel.create(req.body);
        res.json({
            "message": "Pregunta creada correctamente"
        });
    } catch (error) {
        res.json({
            "message": error.message + ", error al crear la pregunta"
        });
    }
};

// Obtener todas las preguntas
exports.getAllQuestions = async (req, res) => {
    try {
        const pregunta = await QuestionModel.findAll();
        res.json(pregunta);
    } catch (error) {
        console.log("Hubo un error al traer los datos");
        res.json({
            "message": error.message
        });
    }
};




exports.getCronometro = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta la base de datos para obtener la pregunta
        const question = await QuestionModel.findOne({
            where: { id },
            attributes: ['TiempoInicio', 'Duracion'], // Solo obtenemos las columnas necesarias
        }); 

        if (!question) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const { TiempoInicio, Duracion } = question;
        if (!TiempoInicio || !Duracion) {
            return res.status(400).json({ error: 'Datos incompletos en la pregunta' });
        }

        // Convertir el formato 'DD/MM/YYYY, HH:mm:ss' a 'YYYY-MM-DDTHH:mm:ss'
        const [fecha, hora] = TiempoInicio.split(', ');
        const [dia, mes, anio] = fecha.split('/');
        const formattedFecha = `${anio}-${mes}-${dia}T${hora}`;

        // Crear la fecha usando el formato adecuado
        const inicio = new Date(formattedFecha);
  
        if (isNaN(inicio.getTime())) {
            return res.status(400).json({ error: 'El formato de TiempoInicio no es válido' });
        }

        // Calcular tiempo transcurrido
        const ahora = Date.now();
        const tiempoTranscurrido = Math.floor((ahora - inicio.getTime()) / 1000); // En segundos
        const duracionEnSegundos = parseInt(Duracion, 10);

        // Validación de la duración
        if (isNaN(duracionEnSegundos)) {
            return res.status(400).json({ error: 'La duración debe ser un número válido' });
        }

        const tiempoRestante = duracionEnSegundos - tiempoTranscurrido;

        res.json({
            tiempoRestante: tiempoRestante > 0 ? tiempoRestante : 0, // Evitar números negativos
            terminado: tiempoRestante <= 0,
        });
    } catch (error) {
        console.error('Error al calcular el cronómetro:', error);
        res.status(500).json({ error: 'Error al calcular el cronómetro' });
    }
};



exports.closeQuestion = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        // Obtener el ID de la pregunta desde req.params
        // Buscar y actualizar el campo Estado a "Cerrada"
        const result = await QuestionModel.update(
            { Estado: "Cerrada" }, // Valores a actualizar
            { where: { id } } // Condición para encontrar la pregunta
        );

        // Verificar si la actualización fue exitosa
        if (result[0] === 0) {
            return res.json({
                message: `No se encontró ninguna pregunta con el ID: ${id}`
            });
        }

        res.json({
            message: "El estado de la pregunta ha sido cambiado a 'Cerrada' exitosamente"
        });
    } catch (error) {
        res.json({
            message: error.message + ", error al cerrar la pregunta"
        });
    }
};