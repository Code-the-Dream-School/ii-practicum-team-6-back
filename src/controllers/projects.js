const Project = require('../models/project')
const ProjectRequest = require('../models/projectRequest')
const {NotFoundError, BadRequestError,ForbiddenError} = require('../errors')
const { getAllCommentsByTheProjectId } = require('../services/commentServices')

const getAllProjects = async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;
    
        const { sort,search } = req.query;
        let filter = {}
        if(search){
            filter = { $text: { $search: search } }
        }
        const projects = await Project.find(filter)
            .skip(skip)
            .limit(limit)
            .lean(); // lean returns plain js objects 

        //in order to add likesCount filed we need to have a js object 
        const projectsWithLikes = projects.map(project => ({
            ...project,
            likesCount: project.likes?.length || 0,
        }));
  
        let sortedProjects = projectsWithLikes;

            if (sort === 'mostLiked') {
            sortedProjects = projectsWithLikes.sort((a, b) => b.likesCount - a.likesCount);
            } else if (sort === 'createdAt-desc') {
            sortedProjects = projectsWithLikes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else {
            sortedProjects = projectsWithLikes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
  
        const numberOfProjects = await Project.countDocuments();
  
        res.status(200).json({
            success: true,
            message: 'Projects fetched successfully',
            data: {
            projects: sortedProjects,
            numberOfProjects,
            currentPage: page,
            totalPages: Math.ceil(numberOfProjects / limit),
            },
        });
    } catch (error) {
      next(error);
    }
  };

const createProject = async(req,res, next)=>{
    try {
        const{title, description, reqSpots, reqSkills }= req.body
        const createdBy = req.user.id
        
        const newProject = await Project.create({
            title,
            description,
            createdBy, 
            reqSpots,
            reqSkills,
            teamMembers:[{user:createdBy,role:'admin'}]
        })
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: { project: newProject }
        });
    } catch (error) {
        next(error);
    }
}

const getProjectById = async(req,res, next)=>{
    try {
        const project = req.project; //comes from middleware
        const comments = await getAllCommentsByTheProjectId(project._id)
        const projectWithlikesCount = {
            ...project.toObject({virtuals:false}), //this does not add additional id field
            likesCount : project.likes.length,
            teamNum: project.teamMembers.length,
            comments,
            availableSpots: project.reqSpots - project.teamMembers.length,
        }
        res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            data: { project: projectWithlikesCount }
        });
    } catch (error) {
        next(error);
    }
}

const updateProject = async (req, res, next) => {
    try {
        const createdBy = req.user.id;
        // Ensure that the project belongs to the user trying to update it
        if (req.project.createdBy.toString() !== createdBy) {
            throw new ForbiddenError("You are not authorized to update this project")
        }
        Object.assign(req.project, req.body);
        const updatedProject = await req.project.save();
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: { project: updatedProject }
        });
    } catch (error) {
        next(error);
    }
  };

const deleteProject = async(req,res, next)=>{
    try {
        const createdBy = req.user.id
         // Ensure that the project belongs to the user trying to delete it
        if (req.project.createdBy.toString() !== createdBy) {
            throw new ForbiddenError('You are not authorized to delete this project')
        }
        const deletedProject=  await req.project.deleteOne();
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: { project: deletedProject }
        });
    } catch (error) {
        next(error);
    }
}

const leaveProject = async(req,res, next)=>{
    try {
        const userId = req.user.id;
        const project = req.project;
        //check if user is a member
        const isMember = project.teamMembers.some(member=> member.user.toString() === userId)

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

const addVote = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const project = req.project;
    
        if (project.likes.includes(userId)) {
            throw new BadRequestError('You already voted for this project');
        }
    
        project.likes.push(userId);
        await project.save();
    
        res.status(200).json({
            success: true,
            message: "Project liked",
            data: { likesCount: project.likes.length }
        });
    } catch (error) {
      next(error); 
    }
  };

const getAllVotes= async(req,res, next)=>{
    const project = req.project;
    const votesCount = project.likes.length;
    res.status(200).json({
        success: true,
        message: "Project likes fetched successfully",
        data: { likesCount: votesCount }
    });
}

const removeVote = async(req,res, next)=>{
    try {

        const userId = req.user.id;
        const project = req.project;
        const index = project.likes.indexOf(userId);
        if (index === -1) {
            throw new BadRequestError('You have not liked this project');
        }
        project.likes.splice(index, 1);
        await project.save();
        res.status(200).json({
            success: true,
            message: "Project unvoted",
            data: { likesCount: project.likes.length }
        });
    } catch (error) {
        next(error)
    }
    
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

const unsendJoinRequest  = async(req,res, next)=>{
    try {
        const userId = req.user.id
        const projectId = req.project._id

        const removeRequest = await ProjectRequest.findOneAndDelete({projectId,userId})
        if(!removeRequest){
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
        const projectId = req.project._id;
        const requests = await ProjectRequest.find({projectId});
        if(!requests){
            throw new NotFoundError('There is no request for this project')
        }
        res.status(200).json({
            success: true,
            message: "Project requests fetched successfuly",
            data: { request: requests }
        });
    } catch (error) {
        next(error)
    }
    
}

module.exports ={
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    leaveProject,
    addVote,
    removeVote,
    sendJoinRequest,
    unsendJoinRequest,
    getProjectJoinRequests,
    getAllVotes
}