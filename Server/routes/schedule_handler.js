/**
 * Created by HyunJae on 2016. 1. 13..
 */

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

function getEvents(con,req,res){
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
        }
        else
        {
            var data;
            for(i=0;i<response.length; i++){
                data = response[i];
                console.log(data);
                var event = new Event(data.s_title,data.s_start_date, data.s_end_date, data.s_flag);
                eventLists.push(event);
            }

            console.log(eventLists);

            getDuty(con,id,year,month,eventLists,function(eventLists){

                getHardware(con,id,eventLists,function(eventLists){

                    getBook(con,id,eventLists,function(eventLists){

                        res.send(eventLists);

                    });
                });
            });
            /**
             * 당직이랑 대여 조회부분
             * year랑 date로 ㄲ
             */

           // res.send(eventLists);
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




exports.getEvents = getEvents;