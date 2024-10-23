import AsambleaModel from './CardModel.js';  // Importar el modelo de asambleas
import QuestionsModel from './QuestionsModel.js'; // Importar el modelo de preguntas
import OptionsModel from './OptionsModel.js'; // Importar el modelo de opciones
import Votos from './VotosMode.js'; // Importar el modelo de votos
import Usuarios from './UsersModel.js'; // Importar el modelo de usuarios (si existe)

// Relación entre Asamblea y Preguntas
AsambleaModel.hasMany(QuestionsModel, {
    foreignKey: 'id_card',
    as: 'preguntas'
});

QuestionsModel.belongsTo(AsambleaModel, {
    foreignKey: 'id_card',
    as: 'asamblea'
});

// Relación entre Pregunta y Opciones
QuestionsModel.hasMany(OptionsModel, {
    foreignKey: 'id_pregunta',
    as: 'opciones'
});

OptionsModel.belongsTo(QuestionsModel, {
    foreignKey: 'id_pregunta',
    as: 'pregunta'
});

// Relación entre Opciones y Votos (una opción tiene muchos votos)
OptionsModel.hasMany(Votos, {
    foreignKey: 'id_Option',
    as: 'votos'
});

Votos.belongsTo(OptionsModel, {
    foreignKey: 'id_Option',
    as: 'opcion'
});

// Relación entre Usuarios y Votos (un usuario puede emitir muchos votos)
Usuarios.hasMany(Votos, {
    foreignKey: 'id_voter',
    as: 'votos'
});

Votos.belongsTo(Usuarios, {
    foreignKey: 'id_voter',
    as: 'usuario'
});

// Relación entre Asamblea y Votos (una asamblea tiene muchos votos)
AsambleaModel.hasMany(Votos, {
    foreignKey: 'id_card',
    as: 'votos'
});

Votos.belongsTo(AsambleaModel, {
    foreignKey: 'id_card',
    as: 'asamblea'
});

export  { AsambleaModel, QuestionsModel, OptionsModel, Votos, Usuarios }; 
