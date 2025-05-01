function toSkillResponseDto(skill) {
  return {
    id: skill._id,
    name: skill.name,
  };
}

function toSkillsResponseDto(skills) {
  return skills.map(toSkillResponseDto);
}

module.exports = { toSkillResponseDto, toSkillsResponseDto };