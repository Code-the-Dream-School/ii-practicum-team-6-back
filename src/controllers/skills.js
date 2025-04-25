const Skill = require('../models/skill')
const{NotFoundError} = require('../errors/not-found')

const getAllSkills = async(req,res)=>{
    try {
        const skills = await Skill.find({})
        if(skills.length == 0){
            throw new NotFoundError('No skill found')
        }
        res.status(200).json({
            success: true,
            message: "Skills fetched successfully",
            data: { skills }
        });
    } catch (error) {
        next(error);
    }
    
}

module.exports = {getAllSkills}