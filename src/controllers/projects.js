const Project = require('../models/Project')
const ProjectRequest = require('../models/projectRequest')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError,UnauthenticatedError} = require('../errors')

const getAllProjects = async(req,res)=>{
    try {
        const projects = await Project.find({})
        res.status(StatusCodes.OK).json({projects})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error fetching projects", error });
    }
}

const createProject = async(req,res)=>{
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
        
        res.status(StatusCodes.CREATED).json({newProject})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error creating project", error });
    }
}

const getProjectById = async(req,res)=>{
    try {
        const project = req.project; //comes from middleware
        res.status(StatusCodes.OK).json({project})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error getting the project", error });
    }
}

const updateProject = async (req, res) => {
    try {
        const createdBy = req.user.id;
        // Ensure that the project belongs to the user trying to update it
        if (req.project.createdBy.toString() !== createdBy) {
            return res.status(StatusCodes.FORBIDDEN).json({msg: "You are not authorized to update this project"});
        }
    
        Object.assign(req.project, req.body);

        const updatedProject = await req.project.save();
    
        return res.status(StatusCodes.OK).json({ project: updatedProject });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error updating the project", error });
    }
  };

const deleteProject = async(req,res)=>{
    try {
        const createdBy = req.user.id
        
         // Ensure that the project belongs to the user trying to delete it
        if (req.project.createdBy.toString() !== createdBy) {
            return res.status(StatusCodes.FORBIDDEN).json({msg: "You are not authorized to delete this project"});
        }
        const deletedProject=  await req.project.deleteOne();
        
        res.status(StatusCodes.OK).json({project:deletedProject})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error deleting the project", error });
    }
}

const leaveProject = async(req,res)=>{
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
        res.status(StatusCodes.OK).json({msg: 'User has successfully left the project' })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error leaving the project", error });
    }
    
}

const addVote = async(req,res)=>{
    const userId = req.user.id;
    const project = req.project;
    //check if user already liked a project
    const alreadyVote = project.likes.includes(userId)
    if(alreadyVote){
        throw new BadRequestError('User already voted for this project')
    }
    project.likes.push(userId);
    await project.save();
    res.status(StatusCodes.OK).json({ msg: 'Project liked', likesCount: project.likes.length });
}


const getAllVotes= async(req,res)=>{
    const project = req.project;
    const votesCount = project.likes.length;
    res.status(StatusCodes.OK).json({votesCount})
}



const removeVote = async(req,res)=>{
    const userId = req.user.id;
    const project = req.project;
    const index = project.likes.indexOf(userId);
    if (index === -1) {
        throw new BadRequestError('You have not liked this project');
    }
    project.likes.splice(index, 1);
    await project.save();
    res.status(StatusCodes.OK).json({ msg: 'Project unvoted', likesCount: project.likes.length });
}

// ============ PROJECT REQUEST  =============



const sendJoinRequest = async(req,res)=>{
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
            return res.status(StatusCodes.OK).json({ msg: 'Join request updated.', request: updatedRequest });
          }
        // Create new join request
        const newRequest = await ProjectRequest.create({
            projectId,
            userId,
            joinMessage,
        });
        res.status(StatusCodes.CREATED).json({ msg: 'Join request sent.', request: newRequest });
      
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error sending join request', error });
    }
}

const unsendJoinRequest  = async(req,res)=>{
    try {
        const userId = req.user.id
        const projectId = req.project._id

        const removeRequest = await ProjectRequest.findOneAndDelete({projectId,userId})
        if(!removeRequest){
            throw new NotFoundError(`No project with id ${projectId}`);
        }
        res.status(StatusCodes.OK).json({msg:"Join Request unsend successfully"})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error unsending join request', error });
    }
   
}

const getProjectJoinRequests = async(req,res)=>{
    const projectId = req.project._id;
    const requests = await ProjectRequest.find({projectId});
    if(!requests){
        throw new NotFoundError('There is no request for this project')
    }
    res.status(StatusCodes.OK).json({requests})
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