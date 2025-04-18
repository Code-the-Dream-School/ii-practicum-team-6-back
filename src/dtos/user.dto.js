function toUserResponseDto(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      avatar: user.avatar || '',
      skills: user.skills || [],
      projectsIds : user.projectsIds || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  function toUsersResponseDto(users) {
    return users.map(toUserResponseDto);
  }
  
  module.exports = { toUserResponseDto, toUsersResponseDto  };