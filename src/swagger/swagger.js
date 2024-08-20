const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');

const swaggerSpecPath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerSpecPath);

// let swaggerDocument;
// try {
//   swaggerDocument = yaml.load(fs.readFileSync(swaggerSpecPath, 'utf8'));
// } catch (e) {
//   console.error(e);
// }

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = swaggerDocs;
