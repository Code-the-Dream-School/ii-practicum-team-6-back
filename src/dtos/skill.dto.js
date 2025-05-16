function toSkillsResponseDto(skills) {
  return skills.map(skill => skill.name);
}

module.exports = {  toSkillsResponseDto };