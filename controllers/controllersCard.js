import Cardmodel from '../models/CardModel.js'




export const getAllCards = async (req, res) => {
    try {
        const card = await Cardmodel.findAll()
        res.json(card)

    } catch (error) {
        console.log("hubo un error al traer las cards")
        res.json({
            "message": error.message
        })
    }
}


export const  getCard = async(req,res)=>{
    try {

        const Card = await Cardmodel.findAll({
            where: { id: req.params.id }
        })
        res.json(Card[0])

    } catch (error) {
        console.log("hubo un error al traer las card")
        res.json({
            "message": error.message
        })
    }
}

export const createCard = async (req, res) => {
    try {
        await Cardmodel.create(req.body)
        res.json({
            "message": "el registro  de la votacion fue exitoso "
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}
