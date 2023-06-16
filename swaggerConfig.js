const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Perkvenue',
      version: '1.0.0',
      description: 'PerkVenue is a cutting-edge digital platform that leverages the power of blockchain technology to revolutionize reward point exchange. With our seamless APIs, businesses can effortlessly utilize NFTs and tokens as reward points to engage customers, without requiring any knowledge of coding or blockchain intricacies.',
    },
  },
  apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
