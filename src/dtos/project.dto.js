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
    reqSkills: project.reqSkills?.map(skill => skill.name) || [],
    teamMembers: project.teamMembers
      .filter(member => member.user) 
      .map(member => ({
        id: member.user._id.toString(),
        username: member.user.username,
        avatar: member.user.avatar?.url || null,
        role: member.role,
      }))
  };
}

function toProjectsResponseDto(projects) {
  return projects.map(toProjectResponseDto);
}

module.exports = { toProjectResponseDto, toProjectsResponseDto };