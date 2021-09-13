var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.render('room', { roomId: req.params.room })
});

module.exports = router;
