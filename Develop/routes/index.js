const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// Handle all other routes with a 404 response
router.use((req, res) => {
  res.status(404).send("<h1>Wrong Route!</h1>");
});

module.exports = router;