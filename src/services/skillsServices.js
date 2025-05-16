const NotFoundError = require('../errors/not-found')
const Skill = require('../models/skill')


exports.getAllSkills = async () => {

    const skills = await Skill.find({})
    .collation({ locale: 'en', strength: 1 })
    .sort({name:1})
    .select('name -_id')

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


