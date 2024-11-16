const AsambleaModel = require('./CardModel.js'); // Importar el modelo de asambleas
const QuestionsModel = require('./QuestionsModel.js'); // Importar el modelo de preguntas
const OptionsModel = require('./OptionsModel.js'); // Importar el modelo de opciones
const Votos = require('./VotosMode.js'); // Importar el modelo de votos
const Usuarios = require('./UsersModel.js'); // Importar el modelo de usuarios (si existe)

// Relación entre Asamblea y Preguntas
AsambleaModel.hasMany(QuestionsModel, {
    foreignKey: 'id_card',  // id de la asamblea en preguntas
    as: 'preguntas'
});

QuestionsModel.belongsTo(AsambleaModel, {
    foreignKey: 'id_card',
    as: 'asamblea'
});

// Relación entre Pregunta y Opciones
QuestionsModel.hasMany(OptionsModel, {
    foreignKey: 'id_pregunta',  // id de la pregunta en opciones
    as: 'opciones'
});

OptionsModel.belongsTo(QuestionsModel, {
    foreignKey: 'id_pregunta',
    as: 'pregunta'
});

// Relación entre Opciones y Votos (si es necesario)
OptionsModel.hasMany(Votos, {
    foreignKey: 'id_Option',  // id de la opción en votos
    as: 'votos'
});

Votos.belongsTo(OptionsModel, {
    foreignKey: 'id_Option',
    as: 'opcion'
});

// Relación entre Usuarios y Votos (si es necesario)
Usuarios.hasMany(Votos, {
    foreignKey: 'id_voter',  // id del usuario en votos
    as: 'votos'
});

Votos.belongsTo(Usuarios, {
    foreignKey: 'id_voter',
    as: 'usuario'
});

// Exportar los modelos con las asociaciones necesarias
module.exports = { AsambleaModel, QuestionsModel, OptionsModel, Votos, Usuarios };
