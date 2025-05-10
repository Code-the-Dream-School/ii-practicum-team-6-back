function toSkillResponseDto(skill) {
  return {
    name: skill.name,
  };
}

function toSkillsResponseDto(skills) {
  return skills.map(toSkillResponseDto);
}

module.exports = { toSkillResponseDto, toSkillsResponseDto };