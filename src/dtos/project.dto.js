function toProjectResponseDto(project) {
  return {
    _id: project._id,
    title: project.title,
    description: project.description,
    createdBy: project.createdBy?.toString?.() || project.createdBy,
    reqSpots: project.reqSpots,
    teamNum: project.teamNum,
    availableSpots: project.availableSpots,
    likes: project.likes,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    reqSkills: project.reqSkills?.map(skill => ({
      name: skill.name
    })) || [],
    teamMembers: project.teamMembers?.map(member => ({
      user: typeof member.user === 'object' ? member.user._id?.toString() : member.user,
      role: member.role
    })) || [],
  };
}

function toProjectsResponseDto(projects) {
  return projects.map(toProjectResponseDto);
}

module.exports = { toProjectResponseDto, toProjectsResponseDto };