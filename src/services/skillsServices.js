const NotFoundError = require('../errors/not-found')
const Skill = require('../models/skill')


exports.getAllSkills = async () => {

    const skills = await Skill.find({}).sort({ name: 1 })
    if (skills.length == 0) {
        throw new NotFoundError('No skills found')
    }
    return skills;

}

exports.searchSkills = async (searchBody) => {

    const skills = await Skill.find({ name: { $regex: searchBody, $options: 'i' } })
    if (skills.length == 0) {
        throw new NotFoundError('No skills found')
    }
    return skills
}


