const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeCrew Project API',
      version: '1.0.0',
      description: 'API documentation for managing projects, join requests, and votes.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints for registrating, authorization, logging out, and resetting password.',
      },
      {
        name: 'User',
        description: 'Endpoints for fetching data about users, updating and deleting profile.',
      },
      {
        name: 'Projects',
        description: 'Endpoints for creating, updating, deleting, and retrieving projects.',
      },
      {
        name: 'Votes',
        description: 'Endpoints for voting on projects (like, unlike, get vote count).',
      },
      {
        name: 'JoinRequests',
        description: 'Endpoints for sending, viewing, and deleting project join requests.',
      },
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '660b01e0cd3f4a3fb40aa67e' },
            title: { type: 'string', example: 'Build an App' },
            description: { type: 'string', example: 'An app for project collaboration.' },
            createdBy: { type: 'string', example: '660aa20dc32c7f5320e9a4e1' },
            reqSpots: { type: 'integer', example: 5 },
            reqSkills: {
              type: 'array',
              items: { type: 'string', example: '660a3aabc32c7f5320e9a4e9' },
            },
            teamMembers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string', example: '660aa20dc32c7f5320e9a4e1' },
                  role: { type: 'string', example: 'admin' },
                },
              },
            },
            likes: {
              type: 'array',
              items: { type: 'string', example: '660aa20dc32c7f5320e9a4e1' },
            },
            createdAt: { type: 'string', example: '2024-04-08T12:00:00Z' },
            updatedAt: { type: 'string', example: '2024-04-08T12:00:00Z' },
          },
        },

        ProjectRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '661b88eeb2c55e5b2aa423ef' },
            project: { type: 'string', example: '660b01e0cd3f4a3fb40aa67e' },
            user: { type: 'string', example: '660aa20dc32c7f5320e9a4e1' },
            message: { type: 'string', example: 'I would like to join your project as a developer.' },
            status: { type: 'string', example: 'pending' },
            createdAt: { type: 'string', example: '2024-04-08T13:00:00Z' },
            updatedAt: { type: 'string', example: '2024-04-08T13:00:00Z' },
          },
        },
        Skill: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '661b88eeb2c55e5b2aa423ef' },
            name: { type: 'string', example: 'JavaScript' },

          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '661b88eeb2c55e5b2aa423ef' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', example: 'johndoe@example.com' },
            bio: { type: 'string', example: 'Full-stack developer with a passion for clean code.' },
            avatar: { type: 'string', example: 'https://cdn.example.com/avatars/val.jpg' },
            skills: {
              type: 'array',
              items: { $ref: '#/components/schemas/Skill' }
            },
            projectsIds: {
              type: 'array',
              items: { type: 'string', example: '660b01e0cd3f4a3fb40aa67e' }
            },
            createdAt: { type: 'string', format: 'date-time', example: '2024-04-08T12:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-04-08T13:00:00Z' },
          }
        }
      },

    },
  },
  apis: ['./src/routes/*.js'], // path to your route files with swagger annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;