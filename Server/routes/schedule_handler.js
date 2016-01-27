/**
 * Created by HyunJae on 2016. 1. 13..
 */

var DB_handler = require('./DB_handler');
var util = require('./util');

function loadSchedule( req, res){

    var con = DB_handler.connectDB();
    var date = req.body;
    var query = 'select a.u_name, b.* from t_user a inner join t_schedule b on a.u_id=b.s_enroll_user where month(s_start_date)="' + date.month + '" and year(s_start_date)="' + date.year + '"';
    con.query(query, function(err, response){
        if(err){
            throw err
        }
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function enrollSchedule(req, res){
    var con = DB_handler.connectDB();
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
    DB_handler.disconnectDB(con);
}

function deleteSchedule(req, res){
    var id = req.body.schedule_id;

    var con = DB_handler.connectDB();
    var delete_query = 'delete from t_schedule where s_id="' + id + '"';
    con.query(delete_query, function(err, response){
        if(err){
            res.send('failed');
        }else{
            res.send('success');
        }
        DB_handler.disconnectDB(con);
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



function Event(title,start,end,flag){
    this.title = title;
    this.start = start;
    this.end = end;
    this.color= null;
    if(flag == 0){
        this.color='#EF5350';
    }else if(flag == 1){
        this.color='#64B5F6';
    }else if(flag == 2){
        this.color='#BA68C8';
    }else if(flag == 3){
        this.color='#388e3c';
    }
}

function getEvents(req,res){
    var con = DB_handler.connectDB();
    var eventLists = [];
    var i ;
    var year = req.body.year;
    var month = req.body.month;
    var id =  req.session.passport.user.id;

    var query = "SELECT * FROM swmem.t_schedule;";
    console.log(query);
    con.query(query, function(err,response){

        if(err)
        {
            console.log(err);
            DB_handler.disconnectDB(con);
        }
        else
        {
            var data;
            for(i=0;i<response.length; i++){
                data = response[i];
                console.log(data);
                var event = new Event(data.s_title,new Date(data.s_start_date.getTime() + 9 * 60 * 60 * 1000), new Date(data.s_end_date.getTime() + 9 * 60 * 60 * 1000), data.s_flag);
                eventLists.push(event);
            }

            console.log(eventLists);

            getDuty(con,id,year,month,eventLists,function(eventLists){

                getHardware(con,id,eventLists,function(eventLists){

                    getBook(con,id,eventLists,function(eventLists){

                        res.send(eventLists);
                        DB_handler.disconnectDB(con);
                    });
                });
            });
            /**
             * 당직이랑 대여 조회부분
             * year랑 date로 ㄲ
             */

        }
    });

}


function getBook(con,id,eventLists,callback){

    var query = "SELECT (SELECT b_name FROM swmem.t_book WHERE b_id = br_book_id) name ,(SELECT b_due_date FROM swmem.t_book WHERE b_id = br_book_id) due_date FROM swmem.t_book_rental " +
        "WHERE br_user = '"+id+"';";
    var i;

    con.query(query, function(err,response){

        if(err){
            console.log(err);
        }else{
            console.log(response);
            var data;
            var title="";
            var convertDate;
            for(i=0;i<response.length;i++){
                data = response[i];
                title ="[반납] ";
                title += data.name;
                var date = new Date(data.due_date).getDate();
                if(date<10){
                    date = "0"+date;
                }
                var month = (new Date(data.due_date).getMonth()+1);
                if(month<10){
                    month = "0"+month;
                }

                convertDate = ""+new Date(data.due_date).getFullYear() + "-" + month + "-" +date;

                var event = new Event(title, convertDate, convertDate, 3);
                eventLists.push(event);
            }
            callback(eventLists);
        }


    });

}



function getHardware(con,id,eventLists,callback){

    var query ="SELECT hr_due_date , (SELECT h_name FROM swmem.t_hardware WHERE h_id = hr_hardware_id) name FROM swmem.t_hardware_rental WHERE hr_user = '" + id + "';";
    var i;


    con.query(query, function(err,response){

        if(err){
            console.log(err);
        }else{
            console.log(response);
            var data;
            var title="";
            var convertDate;
            for(i=0;i<response.length;i++){
                data = response[i];
                title ="[반납] ";
                title += data.name;
                var date = new Date(data.hr_due_date).getDate();
                if(date<10){
                    date = "0"+date;
                }
                var month = (new Date(data.hr_due_date).getMonth()+1);
                if(month<10){
                    month = "0"+month;
                }

                convertDate = ""+new Date(data.hr_due_date).getFullYear() + "-" + month + "-" +date;

                var event = new Event(title, convertDate, convertDate, 3);
                eventLists.push(event);
            }
            callback(eventLists);
        }

    });


}




function getDuty(con,id,year,month,eventLists,callback){

    var query = "select * from swmem.t_duty where ( user_id1 = '" + id + "' or user_id2 = '" + id + "' or user_id3 = '" + id + "' or user_id4 = '" + id
        + "') and month(date)= " + month + " and year(date) = " + year;

    console.log(query);

    con.query(query, function(err, response){

        if(err){
            console.log(err);
        }else{
            for (var i=0;i<response.length;i++){

                var data = response[i];
                var title = "";
                var date = new Date(data.date).getDate();
                if(date<10){
                    date = "0"+date;
                }
                var month = (new Date(data.date).getMonth()+1);
                if(month<10){
                    month = "0"+month;
                }

                var start_end_date = new Date(data.date).getFullYear() + "-" + month + "-" + date;


                if(data.user_id1 == id){
                    if(data.user1_mode == 0){
                        title+="일반당직";
                    }
                    else
                    {
                        title+="벌당직";
                    }
                }
                else if(data.user_id2 == id){
                    if(data.user2_mode == 0){
                        title+="일반당직";
                    }
                    else
                    {
                        title+="벌당직";
                    }
                }
                else if(data.user_id3 == id){
                    if(data.user3_mode == 0 ){
                        title+="일반당직";
                    }
                    else
                    {
                        title+="벌당직";
                    }
                }
                else if(data.user_id4 == id){
                    if(data.user4_mode == 0){
                        title+="일반당직";
                    }
                    else
                    {
                        title+="벌당직";
                    }
                }
                var event = new Event(title, start_end_date, start_end_date, 2);
                eventLists.push(event);
            }
            callback(eventLists);
        }
    });
}



exports.deleteSchedule = deleteSchedule;
exports.enrollSchedule = enrollSchedule;
exports.loadSchedule = loadSchedule;
exports.getEvents = getEvents;
