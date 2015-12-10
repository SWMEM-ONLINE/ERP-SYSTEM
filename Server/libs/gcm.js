var gcm = require('node-gcm');
var fs = require('fs');

function send(title_, content, server_api_key, token){
  var message = new gcm.Message();
  var message = new gcm.Message({
      collapseKey: 'demo',
      delayWhileIdle: true,
      timeToLive: 300,
      data: {
          title: title_,
          message: content,
          custom_key1: 'custom data1',
          custom_key2: 'custom data2'
      }
  });

  //var server_api_key = 'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY';
  var sender = new gcm.Sender(server_api_key);
  var registrationIds = [];
  registrationIds.push(token);

  sender.send(message, registrationIds, 4, function (err, result) {
      console.log(result);
  });
}

exports.send = send;
