var express = require('express');
var router = express.Router();
const app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.redirect(`/${app.uuidV4()}`)
});

module.exports = router;
