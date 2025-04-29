const Project = require('../models/project');
const { NotFoundError } = require('../errors');

const fetchProject = async (req, res, next) => {
    const { id: projectId } = req.params;
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`);
      }
      req.project = project; // attach it to req
      next()
    } catch (err) {
      next(err);
    }
  };

  module.exports = fetchProject;
