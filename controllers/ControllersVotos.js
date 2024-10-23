import VotosMode from "../models/VotosMode.js";


//Trae los votos 
export const getAllVotos = async (req, res) => {
    try {
        const Votos = await VotosMode.findAll()
        res.json(Votos)

    } catch (error) {
        console.log("hubo un error al traer los Votos de los usuarios")
        res.json({
            "message": error.message
        })
    }
}


 
//Registra un voto 
export const RegisterVote = async (req, res) => {
    try {
        await VotosMode.create(req.body)
        res.json({
            "message": "el registro fue exitoso "
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}

export const getVotosByid = async (req, res) => {
    try {
        const votos = await VotosMode.findAll({
            where: { id_Option: req.params.id_Option }
        })
        res.json(votos)
    } catch (error) {
        res.json({
            "message": error.message
        })  
    }
}



