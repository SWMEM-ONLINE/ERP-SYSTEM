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
        this.color='#81C784';
    }
}

function getEvents(con,req,res){
    var eventLists = [];
    var i ;
    var year = req.body.year;
    var month = req.body.month;

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

            /**
             * 당직이랑 대여 조회부분
             * year랑 date로 ㄲ
             */

            res.send(eventLists);
        }
    });

}

exports.getEvents = getEvents;