import QuestionModel from '../models/QuestionsModel.js'

export const  getQuestions =async  (req,res)=> {
    try {
     const Question = await QuestionModel.findAll({
         where: { id_card: req.params.id_card }
     })
     res.json(Question[0])
    } catch (error) {
     res.json({
         "message": error.message
     })
    }
 } 
 
  export const createQuestion = async (req,res)=> {
 try {
     await QuestionModel.create(req.body)
     res.json({
         "message": "pregunta creada correctamente "
     })
     } catch (error) {
       res.json({
         "message": error.message+", error al crear la pregunta"
       })
 }
 }
 

 export const getAllQuestions = async (req, res) => {
    try {
        const pregunta = await QuestionModel.findAll()
        res.json(pregunta)

    } catch (error) {
        console.log("hubo un error al traer los datos")
        res.json({
            "message": error.message
        })
    }
}
