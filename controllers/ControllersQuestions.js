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
