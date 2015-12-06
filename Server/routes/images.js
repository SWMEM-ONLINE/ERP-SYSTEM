/**
 * Created by DBK on 2015. 11. 23..
 */

var express = require('express');
var router = express.Router();
var http = require('http')
var fs = require('fs');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

    console.log("name:"+req.query.name) // form fields
    var name = req.query.name;



    fs.stat("./uploads/"+name, function(err, stat) {

        if (err) throw err; // Fail if the file can't be read.

        console.log('Server running at http://localhost:8124/');

        var ext = name.substring(name.lastIndexOf(".")+1);  // jpg
        console.log('ext:'+ext);

        var rs;
        res.writeHead(200, {
            'Content-Type' : 'image/' + ext,
            'Content-Length' : stat.size,
        });

        rs = fs.createReadStream("./uploads/" + name); // public/img.jpg을 읽는다

        util.pump(rs, res, function(err) {
            if(err) {
                console.log("util.pump error");
                throw err;
            }
        });

    });

});


module.exports = router;
