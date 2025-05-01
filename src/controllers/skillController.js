const skillsServices = require('../services/skillsServices')
const {toSkillsResponseDto} = require('../dtos/skill.dto')

const getAllSkills = async (req, res, next) => {

    try {
        const skills = await skillsServices.getAllSkills()
       
        res.status(200).json({
            success: true,
            message: "Skills fetched successfully",
            data: {skills : toSkillsResponseDto(skills)}
        });
    } catch (error) {
        next(error);
    }
}

const searchSkills = async (req, res, next) => {

    try {
        const searchBody = req.body.searchBody
        const skills = await skillsServices.searchSkills(searchBody)
        res.status(200).json({
            success: true,
            message: "Skills fetched successfully",
            data:  {skills : toSkillsResponseDto(skills)}
        });
    } catch (error) {
        next(error);
    }
}



module.exports = { getAllSkills, searchSkills }