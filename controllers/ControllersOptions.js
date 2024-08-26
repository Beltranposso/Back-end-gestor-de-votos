import OptionModel from '../models/OptionsModel.js'

export const GetallOptions = async (req,res) => {
    try {
        const Option = await OptionModel.findAll()
        res.json(Option)

    } catch (error) {
        console.log("hubo un error al traer las cards")
        res.json({
            "message": error.message
        })
    }
}



export const DeleteOption = async (req, res) => {
    try {
        await OptionModel.destroy({
            where: { id: req.params.id }
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}

export const createoption = async (req,res)=> {
    try {
        await OptionModel.create(req.body)
        res.json({
            "message": "Opcion creada Correctamente"
        })
        } catch (error) {
          res.json({
            "message": error.message
          })
    }
    }
       