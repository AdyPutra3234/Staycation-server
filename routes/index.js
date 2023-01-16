var express = require('express');
var router = express.Router();
// const adminPage = require('startbootstrap-sb-admin-2/blank.html')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/admin/login');
});

module.exports = router;
