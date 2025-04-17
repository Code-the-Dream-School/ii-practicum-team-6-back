const Skill = require('../models/skill')
const {StatusCodes} = require('http-status-codes')

const getAllSkills = async(req,res)=>{
    const skills = await Skill.find({})
    if(skills.length == 0){
        res.status(StatusCodes.NOT_FOUND).json({msg:'No skills found'})
    }
    res.status(StatusCodes.OK).json({skills})
}

module.exports = {getAllSkills}