const Project = require('../models/project')
const ProjectRequest = require('../models/projectRequest')
const {NotFoundError, BadRequestError,ForbiddenError} = require('../errors')

const getAllProjects = async(req,res, next)=>{
    try {
        const {sort}= req.query;
        let sortOption = {};
        if(sort == 'createdAt-asc'){
            sortOption = {createdAt : 1}
        }
        else if(sort == 'createdAt-desc'){
            sortOption = {createdAt :-1}
        }
        const projects = await Project.find({}).sort(sortOption)
        const numberOfProjects = projects.length;
        const projectLikesCount = projects.map(project=>{
            return{
                ...project.toObject(),
                likesCount : project.likes.length // added likesCount field
            }
        })
        res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            data: { 
                projects: projectLikesCount ,
                numberOfProjects
             }
        });
    } catch (error) {
        next(error);
    }
}

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
        const projectWithlikesCount = {
            ...project.toObject(),
            likesCount : project.likes.length
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

const addVote = async(req,res, next)=>{
    const userId = req.user.id;
    const project = req.project;
    //check if user already liked a project
    const alreadyVote = project.likes.includes(userId)
    if(alreadyVote){
        throw new BadRequestError('User already voted for this project')
    }
    project.likes.push(userId);
    await project.save();
    res.status(200).json({
        success: true,
        message: "Project liked",
        data: { likesCount: project.likes.length }
    });
}

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
}

// ============ PROJECT REQUEST  =============
const sendJoinRequest = async(req,res, next)=>{
    try {
        const userId = req.user.id
        const {joinMessage} = req.body;
        const project = req.project;
        const projectId = project._id;
        if(!userId || !joinMessage){
            throw new BadRequestError('User ID and join message are required')
        }
        //check if user is a member
        const isMember = project.teamMembers.some(member => member.user.toString() === userId)
       
        if (isMember) {
            throw new BadRequestError('User is already a project member.');
          }
        //check if a request is already exists
        const updatedRequest = await ProjectRequest.findOneAndUpdate(
            { projectId, userId },
            { status: "pending", joinMessage },
            { new: true }
          );
          if(updatedRequest){
            return res.status(200).json({
                success: true,
                message: "Join request updated",
                data: { request: updatedRequest }
            });
          }
        // Create new join request
        const newRequest = await ProjectRequest.create({
            projectId,
            userId,
            joinMessage,
        });
        res.status(200).json({
            success: true,
            message: "Join request sent",
            data: { request: newRequest }
        });
      
    } catch (error) {
        next(error);
    }
}

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