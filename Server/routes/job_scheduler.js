/**
 * Created by HyunJae on 2016. 1. 13..
 */

var handelr = require('./job_schedule_handler');
var CronJob = require('cron').CronJob;

/**
 *
 *
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11
    Day of Week: 0-6

 */

// "0 30 20 * * *" 매일 8시 30분마다 실행되는 부분
new CronJob('0 0 0 * * *', function() {
    console.log('매일 08시 30분 00초');
    handelr.nextDayDuty();

}, null, true, 'Asia/Seoul');



// "0 0 0 * * *" 매일 열두시마다 실행되는 부분
new CronJob('0 0 0 * * *', function() {
    console.log('매일 00시 00분 00초');

}, null, true, 'Asia/Seoul');



// "0 0 1 * *" 매달한번
new CronJob('0 0 0 1 * *', function() {
    console.log('매달 1일 00시 00분 00초');




}, null, true, 'Asia/Seoul');

