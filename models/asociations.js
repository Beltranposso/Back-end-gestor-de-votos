const AsambleaModel = require('./CardModel.js');
const QuestionsModel = require('./QuestionsModel.js');
const OptionsModel = require('./OptionsModel.js');
const Votos = require('./VotosMode.js');
const UsuariosDefinitive = require('./UsuariosModelD.js');
const Usuarios = require('./UsersModel.js');

// Relación: Asamblea -> Preguntas
AsambleaModel.hasMany(QuestionsModel, {
    foreignKey: 'id_card',
    as: 'preguntas'
});
QuestionsModel.belongsTo(AsambleaModel, {
    foreignKey: 'id_card',
    as: 'asamblea'
});

// Relación: Asamblea -> Usuarios
AsambleaModel.hasMany(Usuarios, {
    foreignKey: 'id_card',
    as: 'usuarios' // Cambié 'Usuarios' a minúsculas para coherencia
});
Usuarios.belongsTo(AsambleaModel, {
    foreignKey: 'id_card',
    as: 'asamblea'
});

// Relación: Preguntas -> Opciones
QuestionsModel.hasMany(OptionsModel, {
    foreignKey: 'id_pregunta',
    as: 'opciones'
});
OptionsModel.belongsTo(QuestionsModel, {
    foreignKey: 'id_pregunta',
    as: 'pregunta'
});

// Relación: Opciones -> Votos
OptionsModel.hasMany(Votos, {
    foreignKey: 'id_Option',
    as: 'votos'
});
Votos.belongsTo(OptionsModel, {
    foreignKey: 'id_Option',
    as: 'opcion'
});

// Relación: UsuariosDefinitive -> Votos
UsuariosDefinitive.hasMany(Votos, {
    foreignKey: 'id_voter',
    sourceKey: 'Cedula',
    as: 'votos'
});
Votos.belongsTo(UsuariosDefinitive, {
    foreignKey: 'id_voter',
    targetKey: 'Cedula',
    as: 'usuarios'
});

// Exportar los modelos con las asociaciones necesarias
module.exports = {
    AsambleaModel,
    QuestionsModel,
    OptionsModel,
    Votos,
    UsuariosDefinitive,
    Usuarios
};
