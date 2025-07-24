const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "CareConnect API",
    description: "API documentation for Medications, Auth, Bus Arrival, etc.",
  },
  host: "localhost:3000", // change to your deployment domain later if needed
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

swaggerAutogen(outputFile, routes, doc);
