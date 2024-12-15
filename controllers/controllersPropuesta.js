const PropuestasModel = require('../models/PropuestasModel.js');
const {QuestionsModel,OptionsModel,AsambleaModel} = require('../models/asociations.js')
// Obtener preguntas por id de la tarjeta
exports.getPropuesta = async (req, res) => {
    try {
        const Question = await PropuestasModel.findAll({
            where: { id_card: req.params.id_card }
        });
        res.json(Question);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

exports.getPropuestaID = async (req, res) => {
    try {
        const Question = await PropuestasModel.findAll({
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

exports.createPropuesta = async (req, res) => {
    try {
        // Los datos vienen en un array, así que debes acceder al primer elemento
        const proposalData = req.body[0];
        const {id, title, options, id_card } = proposalData;
        
        console.log('Datos recibidos:', proposalData);

        // Validar datos
        if (!title || !id_card || !Array.isArray(options)) {
            return res.status(400).json({ message: 'Datos inválidos. Asegúrate de enviar un id, title, id_card y options como un array.' });
        }

        // Preparar los datos para bulkCreate
        const dataToCreate = [{
            id,
            id_card,
            title,
            options: options // Convertir a JSON
        }];

        // Usar bulkCreate con un array de un solo elemento
        const newProposal = await PropuestasModel.bulkCreate(dataToCreate);

        res.status(201).json({
            message: 'Propuesta guardada exitosamente',
            data: newProposal[0], // Acceder al primer (y único) elemento
        });
    } catch (error) {
        console.error('Error al guardar la propuesta:', error);
        res.status(500).json({ 
            message: 'Error al guardar la propuesta', 
            error: error.message 
        });
    }
};


// Obtener todas las preguntas
exports.getAllPropuestas = async (req, res) => {
    try {
        const pregunta = await PropuestasModel.findAll();
        res.json(pregunta);
    } catch (error) {
        console.log("Hubo un error al traer los datos");
        res.json({
            "message": error.message
        });
    }
};exports.createProposal = async (req, res) => {
    // Extraer preguntas del body
    const { id_card, preguntas } = req.body;

    console.log('Datos recibidos:', req.body);

    try {
        // Validar que preguntas sea un array
        if (!Array.isArray(preguntas)) {
            return res.status(400).json({ 
                message: 'Las preguntas deben ser un array',
                receivedData: req.body 
            });
        }

        // Inicializar arrays para preguntas y opciones
        const questionsData = [];
        const optionsData = []; 

        // Verificar si el id_card existe en la base de datos
        const asamblea = await AsambleaModel.findByPk(id_card);
        if (!asamblea) { 
            return res.status(400).json({ message: `El id_card ${id_card} no existe.` });
        }

        // Iterar sobre cada pregunta
        for (const preguntaData of preguntas) {
            const { id, title, options } = preguntaData;

            // Crear la pregunta en la base de datos
            const question = await QuestionsModel.create({
                id: id,
                id_card: id_card,
                Pregunta: title,
            });

            // Crear las opciones para cada pregunta
            const optionsCreated = options.map(opcion => ({
                id_pregunta: question.id,
                opcion: opcion,
            }));

            // Añadir las opciones creadas al array optionsData
            optionsData.push(...optionsCreated);
            
            // Añadir la pregunta creada al array questionsData
            questionsData.push(question);
        }

        // Crear las opciones en la base de datos
        await OptionsModel.bulkCreate(optionsData);

        // Responder al cliente con éxito
        res.status(201).json({
            message: 'Propuestas creadas con éxito',
            questions: questionsData,
            options: optionsData,
        });

    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            message: 'Error al crear las propuestas',
            errorDetails: error.message 
        });
    }
}