const Project = require('../models/Project')
const ProjectRequest = require('../models/projectRequest')
const {StatusCodes, NOT_FOUND} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')

//list all projects
const getAllProjects = async(req,res)=>{
    try {
        const projects = await Project.find({})
        res.status(StatusCodes.OK).json({projects})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error fetching projects", error });
    }
}

//create a new project
const createProject = async(req,res)=>{
    try {
        // const{title, description, reqSpots, reqSkills }= req.body
        // const userId = req.user.id
        const{title, description,reqSpots,reqSkills,createdBy }= req.body
        const newProject = await Project.create({
            title,
            description,
            createdBy, 
            reqSpots,
            reqSkills,
            teamMembers:[{user:createdBy,role:'admin'}]
        })
        console.log('new project ',newProject);
        
        res.status(StatusCodes.CREATED).json({newProject})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error creating project", error });
    }
}

//find a project by its id
const getProjectById = async(req,res)=>{
    try {
        const project = req.project; //comes from middleware
        res.status(StatusCodes.OK).json({project})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error getting the project", error });
    }
}

//update a project record(only the project owner)
const updateProject = async (req, res) => {
    try {
        // const createdBy = req.user.id;
        const { createdBy } = req.body; // Extract createdBy from the request body
    
        // Ensure that the project belongs to the user trying to update it
        if (req.project.createdBy.toString() !== createdBy) {
            return res.status(StatusCodes.FORBIDDEN).json({msg: "You are not authorized to update this project"});
        }
    
        Object.assign(req.project, req.body);
    
        // Save the updated project to the database
        const updatedProject = await req.project.save();
    
        return res.status(StatusCodes.OK).json({ project: updatedProject });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error updating the project", error });
    }
  };

//delete a project record
const deleteProject = async(req,res)=>{
    try {
        // const createdBy = req.user.id
        const {createdBy} = req.body;
         // Ensure that the project belongs to the user trying to delete it
        if (req.project.createdBy.toString() !== createdBy) {
            return res.status(StatusCodes.FORBIDDEN).json({msg: "You are not authorized to delete this project"});
        }
        const deletedProject=  await req.project.remove();
        res.status(StatusCodes.OK).json({project:deletedProject})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error getting the project", error });
    }
}

//user leave a project
const leaveProject = async(req,res)=>{
    try {
        // const userId = req.user.id;
        const {userId} = req.body;
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

//add vote/like to a project
const addVote = async(req,res)=>{
    // const userId = req.user.id;
    const {userId} = req.body;
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
//get all votes for a project
const getAllVotes= async(req,res)=>{
    const projectId = req.params.id
    // const userId = req.user.id;
    const {userId} = req.body;
    const project= await Project.findById(projectId)
    if(!project){
        throw new NotFoundError(`No project with id ${projectId}`)
    }
    const votesCount = project.likes.length;
    res.status(StatusCodes.OK).json({votesCount})
}

//remove a vote for a project
const removeVote = async(req,res)=>{
    const projectId = req.params.id
    // const userId = req.user.id;
    const {userId} = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`);
    }

    const index = project.likes.indexOf(userId);
    if (index === -1) {
        throw new BadRequestError('You have not liked this project');
    }

    project.likes.splice(index, 1);
    await project.save();

    res.status(StatusCodes.OK).json({ msg: 'Project unvoted', likesCount: project.likes.length });
}

// ============ PROJECT REQUEST  =============

//send a join request for a project
const sendJoinRequest = async(req,res)=>{
    try {
        // const userId = req.user.id
        const {userId,joinMessage} = req.body;
        const project = req.project;
        //check if user is a member
        const isMember = project.teamMembers.some(member => member.user.toString() === userId)
       
        if (isMember) {
            throw new BadRequestError('User is already a project member.');
          }
        //check if a request is already exists
        const existingRequest = await ProjectRequest.findOne({projectId, userId})
    
        if (existingRequest.status) {
            existingRequest.status = 'pending';
            existingRequest.joinMessage = joinMessage;
            await existingRequest.save();
            return res.status(StatusCodes.OK).json({ msg: 'Join request updated.', request: existingRequest });
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

//get all join requests for a project
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
    getProjectJoinRequests,
    getAllVotes
}