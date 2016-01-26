/**
 * Created by HyunJae on 2016. 1. 4..
 */


function inquireCheckList(con,req,res){

    var grade = req.body.grade;

    var query = "SELECT * FROM swmem.t_duty_checklist where grade <= '" + grade + "' order by section, grade;";

    var sendData = [];

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            for(var i = 0 ; i< response.length; i++){
                var data = response[i];
                 sendData.push(data);
            }

            res.send(sendData);
        }
    });
}


function inquireAllCheckList(con,req,res){

    var query = "SELECT * FROM swmem.t_duty_checklist order by section;";

    var sendData = [];

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{

            for(var i = 0 ; i< response.length; i++){
               sendData.push(response[i]);
            }

            res.send(sendData);
        }
    });
}

function insertCheckList(con,req,res){


    var grade = req.body.grade;
    var section = req.body.section;
    var content = req.body.content;


    var table = "t_duty_checklist";


    var query = "INSERT INTO `swmem`.`" +table +  "` " +
        "(`grade`, `section`, `content`) " +
        "VALUES ('" + grade + "', '" + section + "', '" + content+ "');";


    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            console.log(response);
            res.send("success");
        }
    });

}

function modifyCheckList(con,req,res){


    var grade = req.body.grade;
    var section = req.body.section;
    var content = req.body.content;
    var index = req.body.index;

    var table = "t_duty_checklist";

    var query = "UPDATE `swmem`.`"+ table +"` " +
        "SET `grade`='"+grade+"', `section`='" + section +"', `content`='" +  content + "' " +
        "WHERE `index`='" + index + "';";

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            console.log(response);
            res.send("success");
        }
    });



}

function deleteCheckList(con,req,res){


    var index = req.body.index;

    var table = "t_duty_checklist";

    var query = "DELETE FROM `swmem`.`" + table + "`" +
        " WHERE `index`='" + index + "'";

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            console.log(response);
            res.send("success");
        }
    });

}


function inquireALLBadCheckList(con,req,res){

    var query = "SELECT * FROM swmem.t_duty_bad_checklist;";

    var sendData = [];

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{

            for(var i = 0 ; i< response.length; i++){
                sendData.push(response[i]);
            }

            res.send(sendData);
        }
    });
}


function inquireBadCheckList(con,req,res){

    var day = req.body.day;

    var query = "SELECT * FROM swmem.t_duty_bad_checklist where day = '" + day + "';";

    var sendData = [];

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{

            for(var i = 0 ; i< response.length; i++){
               sendData.push(response[i]);
            }

            res.send(sendData);
        }
    });
}

function insertBadCheckList(con,req,res){


    var day = req.body.day;
    var section = req.body.section;
    var content = req.body.content;


    var table = "t_duty_bad_checklist";


    var query = "INSERT INTO `swmem`.`" +table +  "` " +
        "(`day`, `section`, `content`) " +
        "VALUES ('" + day + "', '" + section + "', '" + content+ "');";


    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            console.log(response);
            res.send("success");
        }
    });

}

function modifyBadCheckList(con,req,res){


    var day = req.body.day;
    var section = req.body.section;
    var content = req.body.content;
    var index = req.body.index;

    var table = "t_duty_bad_checklist";

    var query = "UPDATE `swmem`.`"+ table +"` " +
        "SET `day`='"+day+"', `section`='" + section +"', `content`='" +  content + "' " +
        "WHERE `index`='" + index + "';";

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            console.log(response);
            res.send("success");
        }
    });



}

function deleteBadCheckList(con,req,res){


    var index = req.body.index;

    var table = "t_duty_bad_checklist";

    var query = "DELETE FROM `swmem`.`" + table + "`" +
        " WHERE `index`='" + index + "'";

    console.log(query);
    con.query(query, function(err, response){

        if(err)
        {
            console.log(err);
            res.send(err);
        }
        else{
            console.log(response);
            res.send("success");
        }
    });

}


function getRecentGrade(con,req,res){

    var query = "SELECT l_grade FROM swmem.t_life where l_recent = 1;";

    console.log(query);
    con.query(query,function(err,response){

        if(err){
            console.log("error");
            res.send("error");
        }else{
            console.log(response);

            if(response.length==0){
                console.log("no recent grade");
                res.send("error");
            }else{

                var data = response[0];
                var grade = data.l_grade;

                console.log(response);
                console.log(data);
                console.log(grade);
                res.send(grade);

            }


        }

    });
}



exports.inquireCheckList = inquireCheckList;
exports.inquireAllCheckList = inquireAllCheckList;
exports.insertCheckList = insertCheckList;
exports.modifyCheckList = modifyCheckList;
exports.deleteCheckList = deleteCheckList;

exports.inquireBadCheckList = inquireBadCheckList;
exports.inquireALLBadCheckList = inquireALLBadCheckList;
exports.insertBadCheckList = insertBadCheckList;
exports.modifyBadCheckList = modifyBadCheckList;
exports.deleteBadCheckList = deleteBadCheckList;

exports.getRecentGrade = getRecentGrade;

