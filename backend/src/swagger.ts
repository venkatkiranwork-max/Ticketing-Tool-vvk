export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TicketFlow Enterprise REST API',
    version: '1.0.0',
    description: 'Production-ready RESTful API for TicketFlow enterprise ticket management SaaS system.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'Authenticate User and retrieve JWT Tokens',
        responses: { '200': { description: 'Login Successful' } },
      },
    },
    '/users': {
      get: {
        summary: 'Retrieve all users with role-scoped filtering',
        responses: { '200': { description: 'Success' } },
      },
    },
    '/projects': {
      get: {
        summary: 'Retrieve project catalog',
        responses: { '200': { description: 'Success' } },
      },
    },
    '/issues': {
      get: {
        summary: 'Retrieve sprint board cards and DataGrid issues',
        responses: { '200': { description: 'Success' } },
      },
    },
  },
};
