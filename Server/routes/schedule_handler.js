/**
 * Created by HyunJae on 2016. 1. 13..
 */

var util = require('./util');

function loadSchedule(con, req, res){
    var date = req.body;
    var query = 'select a.u_name, b.* from t_user a inner join t_schedule b on a.u_id=b.s_enroll_user where month(s_start_date)="' + date.month + '" and year(s_start_date)="' + date.year + '"';
    con.query(query, function(err, response){
        if(err){
            throw err
        }
        res.send(response);
    });
}

function enrollSchedule(con, req, res){
    var flag = req.body.flag;
    var start_date = convertDateformat(req.body.start_date);
    var end_date = convertDateformat(req.body.end_date);
    var grade = util.getUserGrade(req);

    if(flag === '1'){                 // 내용 변경 케이스
        var alter_query = 'update t_schedule set s_title="' + req.body.title + '", s_start_date="' + start_date + '", s_end_date="' + end_date + '", s_enroll_user="' + req.session.passport.user.id + '" where s_id="' + req.body.schedule_id + '"';
        con.query(alter_query, function(err, response){
            if(err){
                res.send('alter_failed');
            }else{
                res.send('alter');
            }
        });
    }else{                          // 등록하는 케이스
        var enroll_query = 'insert into t_schedule SET ?';
        var s_data = {
            s_title : req.body.title,
            s_enroll_user : req.session.passport.user.id,
            s_start_date : start_date,
            s_end_date : end_date,
            s_flag : grade
        };
        con.query(enroll_query, s_data, function(err, response){
            if(err){
                res.send('enroll_failed');
            }else{
                res.send('enroll');
            }
        });
    }
}

function deleteSchedule(con, req, res){
    var id = req.body.schedule_id;
    var delete_query = 'delete from t_schedule where s_id="' + id + '"';
    con.query(delete_query, function(err, response){
        if(err){
            res.send('failed');
        }else{
            res.send('success');
        }
    });
}

function convertDateformat(base){
    var div = base.split(' ');
    var dateformat = div[0] + ' ';

    if(div[1] === 'AM'){
        if(div[2] === '12') dateformat += '00';
        else    dateformat += div[2];
    }else{
        if(div[2] === '12') dateformat += '12';
        else    dateformat += (parseInt(div[2]) + 12);
    }
    return dateformat;
}

exports.deleteSchedule = deleteSchedule;
exports.enrollSchedule = enrollSchedule;
exports.loadSchedule = loadSchedule;