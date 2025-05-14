const Project = require('../models/project')
const ProjectRequest = require('../models/projectRequest')
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors')
const { getAllCommentsByTheProjectId } = require('../services/commentServices')
const Skill = require('../models/skill')


const getAllProjects = async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const { sort, search,skills } = req.query;
        let filter = {};
        if (search) {
            filter = { $text: { $search: search } };
        }
       
        if(skills){
            const skillNames = Array.isArray(skills) ? skills : skills.split(',').map(s=> s.trim())
            if(skillNames.length){
                const skillDocs = await Skill.find({name: {$in : skillNames}}).select('_id')
                const skillIds = skillDocs.map(skill => skill._id)
                if(skillIds.length){
                    filter.reqSkills = {$all:skillIds}
                }
            }
        }
        let sortOption = { createdAt: 1 }; 

        if (sort === 'mostLiked') {
            sortOption = { likesCount: -1 };
        } else if (sort === 'createdAt-desc') {
            sortOption = { createdAt: -1 };
        }

        const [projects, numberOfProjects] = await Promise.all([
            Project.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .populate('reqSkills', 'name')
                .lean(),
            Project.countDocuments(filter)
        ]);
        
        res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            data: {
                projects,
                numberOfProjects,
                currentPage: page,
                totalPages: Math.ceil(numberOfProjects / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

const createProject = async (req, res, next) => {
    try {
        const { title, description, reqSpots, reqSkills } = req.body
        const createdBy = req.user.id

        const skills = await Skill.find({ name: { $in: reqSkills } }).select('_id name').lean();
        const sortedSkills = skills.sort((a, b) => a.name.localeCompare(b.name));
        const skillIds = sortedSkills.map(skill => skill._id);
    
        const newProject = await Project.create({
            title,
            description,
            createdBy,
            reqSpots,
            reqSkills: skillIds ,
            teamMembers: [{ user: createdBy, role: 'admin' }]
        })
        // Populate skills by name 
        await newProject.populate('reqSkills', 'name');

        const skillNames = (newProject.reqSkills || []).map(skill => skill.name)
  
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: { project: {
                ...newProject.toObject(),
                reqSkills:skillNames
            } }
        });
    } catch (error) {
        next(error);
    }
}

const getProjectById = async (req, res, next) => {
    try {
        const project = req.project; //comes from middleware
        const comments = await getAllCommentsByTheProjectId(project._id)
        
        await project.populate('reqSkills','name')
        const skillsname = (project.reqSkills || []).map(skill=>skill.name)

        const projectWithComments = {
            ...project.toObject(), 
            comments,
            reqSkills:skillsname
        }
        res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            data: { project: projectWithComments }
        });
    } catch (error) {
        next(error);
    }
}

const updateProject = async (req, res, next) => {
    try {
      const createdBy = req.user.id;
  
      if (req.project.createdBy.toString() !== createdBy) {
        throw new ForbiddenError("You are not authorized to update this project");
      }
  
      const { reqSkills, ...otherFields } = req.body;

      Object.assign(req.project, otherFields);
  
        const skills = await Skill.find({ name: { $in: reqSkills } }).select('_id name').lean();
        const sortedSkills = skills.sort((a, b) => a.name.localeCompare(b.name));
        const skillIds = sortedSkills.map(skill => skill._id);
        req.project.reqSkills = skillIds;

      const updatedProject = await req.project.save();

      //return skills name
      await updatedProject.populate('reqSkills','name')
      const skillNames = (updatedProject.reqSkills || []).map(skill => skill.name) 

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: { project: {
            ...updatedProject.toObject(),
            reqSkills:skillNames
        } }
      });
  
    } catch (error) {
      next(error);
    }
  };

const deleteProject = async (req, res, next) => {
    try {
        const createdBy = req.user.id
        // Ensure that the project belongs to the user trying to delete it
        if (req.project.createdBy.toString() !== createdBy) {
            throw new ForbiddenError('You are not authorized to delete this project')
        }
        const deletedProject = await req.project.deleteOne();
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: { project: deletedProject }
        });
    } catch (error) {
        next(error);
    }
}

const leaveProject = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const project = req.project;
        //check if user is a member
        const isMember = project.teamMembers.some(member => member.user.toString() === userId)

        if (!isMember) {
            throw new BadRequestError('User is not a team member of this project');
        }
        // Remove user from teamMembers
        project.teamMembers = project.teamMembers.filter(
            member => member.user.toString() !== userId
        );
        await project.save();
        res.status(200).json({
            success: true,
            message: "User has successfully left the project",
        });
    } catch (error) {
        next(error);
    }
}

const toggleVote = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const project = req.project;
        
        //remove the vote if user double click the button
        if (project.likes.includes(userId)) {
            project.likes = project.likes.filter(id => id.toString() !== userId.toString())
            await project.save()
            res.status(200).json({
                success: true,
                message: "Project unliked",
                data: { likesCount: project.likes.length }
            })
        }
        else{
            project.likes.push(userId);
            await project.save();
        
            res.status(200).json({
                success: true,
                message: "Project liked",
                data: { likesCount: project.likes.length}
            });
        }
        
    } catch (error) {
      next(error); 
    }
  };

const getAllVotes = async (req, res, next) => {
    const project = req.project;
    const votesCount = project.likes.length;
    res.status(200).json({
        success: true,
        message: "Project likes fetched successfully",
        data: { likesCount: votesCount }
    });
}


// ============ PROJECT REQUEST  =============
const sendJoinRequest = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { joinMessage } = req.body;
        const project = req.project;
        const projectId = project._id;
    
        if (!joinMessage) {
            throw new BadRequestError('Join message is required');
        }
    
        // Check if user is already a team member
        const isMember = project.teamMembers.some(member => member.user.toString() === userId);
        if (isMember) {
            throw new BadRequestError('User is already a project member.');
        }
    
        // Check if a join request already exists
        const existingRequest = await ProjectRequest.findOne({ projectId, userId });
        if (existingRequest) {
            return res.status(400).json({
            success: false,
            message: 'You have already sent a join request for this project.',
            });
        }
        // Create a new join request
        const newRequest = await ProjectRequest.create({
            projectId,
            userId,
            joinMessage,
        });
        res.status(200).json({
            success: true,
            message: 'Join request sent',
            data: { request: newRequest }
        });
    } catch (error) {
      next(error);
    }
};
const unsendJoinRequest = async (req, res, next) => {
    try {
        const userId = req.user.id
        const projectId = req.project._id

        const removeRequest = await ProjectRequest.findOneAndDelete({ projectId, userId })
        if (!removeRequest) {
            throw new NotFoundError(`No request found for project with id ${projectId}`);
        }
        res.status(200).json({
            success: true,
            message: "Join Request unsend successfully",
        });
    } catch (error) {
        next(error);
    }
}

const getProjectJoinRequests = async(req,res, next)=>{
    try {
        const project = req.project
        const projectId = req.project._id;
        const userId = req.user.id;

        if(project.createdBy === userId){
            const requests = await ProjectRequest.find({projectId});
            if(!requests){
                throw new NotFoundError('There is no request for this project')
            }
            res.status(200).json({
                success: true,
                message: "Project requests fetched successfuly",
                data: { request: requests }
            });
        }
        else{
            throw new ForbiddenError("You are not authorized to view join requests for this project");
        }
        
    } catch (error) {
        next(error)
    }
}

const reviewJoinRequest = async(req,res,next)=>{
    try {        
        const {action} = req.body;
        const {requestId} = req.params
        const request = await ProjectRequest.findById(requestId)
        if(!request){
            throw new NotFoundError('Join request not found')
        }
        if(action === 'approve'){
            request.status = 'approved'
            await Project.findByIdAndUpdate(request.projectId, {
                $push: { teamMembers: { user: request.userId, role: "member" } }
              });
        }
        else if(action === 'decline'){
            request.status = 'declined'
            //check if the user is already a member of the project remove it
            const project = await Project.findById(request.projectId)
            const isMember = project.teamMembers.some(
                (member) => member.user.toString() === request.userId.toString()
            )
            if(isMember){
                await Project.findByIdAndUpdate(request.projectId,{
                    $pull:{teamMembers: {user:request.userId}}
                })
            }
        }
        else{
            throw new BadRequestError('Invalid action')
        }
        await request.save();

        res.status(200).json({
        success: true,
        message: `Request ${action}ed successfully`,
        data: { request }
        });
    } catch (error) {
        next(error)
    }
    

}

module.exports = {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    leaveProject,
    toggleVote,
    sendJoinRequest,
    unsendJoinRequest,
    reviewJoinRequest,
    getProjectJoinRequests,
    getAllVotes
}