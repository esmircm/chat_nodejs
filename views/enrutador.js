var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//	res.render('index2');
//});

router.get('/', function(req, res) {
  res.sendfile(__dirname + '/index2.html');
});

module.exports = router;
