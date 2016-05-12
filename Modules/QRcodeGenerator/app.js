var qr = require('qr-image');
var fs = require('fs');

var code = qr.image('http://blog.nodejitsu.com', { type: 'png' });
var output = fs.createWriteStream('nodejitsu.png');

code.pipe(output);
