
// QR코드 라이브러리인 qr-image를 넣는다.
var qr = require('qr-image');
var fs = require('fs');
// 원하는 문자열을 넣어준다.
var str = "SoonHOOOO"

var code = qr.image(str, { type: 'png' });

// qrcode.png 파일을 생성하는 코드
var output = fs.createWriteStream('qrcode.png')

code.pipe(output);
