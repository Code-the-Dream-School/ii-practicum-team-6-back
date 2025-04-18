const Skill = require('../models/skill')
const {StatusCodes} = require('http-status-codes')

const getAllSkills = async(req,res)=>{
    try {
        const skills = await Skill.find({})
        if(skills.length == 0){
            res.status(StatusCodes.NOT_FOUND).json({msg:'No skills found'})
        }
        res.status(StatusCodes.OK).json({skills})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).josn({ msg: "Error getting skills", error })
    }
    
}

module.exports = {getAllSkills}