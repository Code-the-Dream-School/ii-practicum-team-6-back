const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeCrew',
      version: '1.0.0',
      description: 'API for managing projects and join requests',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', 
      },
    ],
    components: {
        schemas: {
          ProjectInput: {
            type: 'object',
            required: ['title', 'description', 'createdBy', 'reqSpots'],
            properties: {
              title: { type: 'string', example: 'Build an App' },
              description: { type: 'string', example: 'An app for project collaboration.' },
              createdBy: { type: 'string', example: '660aa20dc32c7f5320e9a4e1' },
              reqSpots: { type: 'integer', example: 5 },
              reqSkills: {
                type: 'array',
                items: { type: 'string', example: '660a3aabc32c7f5320e9a4e9' },
              },
            },
          },
          ProjectResponse: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              createdBy: { type: 'string' },
              reqSpots: { type: 'integer' },
              reqSkills: {
                type: 'array',
                items: { type: 'string' },
              },
              teamMembers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    user: { type: 'string' },
                    role: { type: 'string', enum: ['admin', 'user'] },
                  },
                },
              },
              likes: {
                type: 'array',
                items: { type: 'string' },
              },
              teamNum: { type: 'integer' },
              availableSpots: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
  },
  apis: ['./src/routes/*.js'], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;