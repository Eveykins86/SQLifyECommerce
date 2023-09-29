const apiRoutes = require('./api');
const router = require('express').Router();

router.use('/api', apiRoutes);

router.use((req, res) => {
  res.send('<h1>Wrong Route!</h1>')
});

module.exports = router;