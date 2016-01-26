/**
 * Created by HyunJae on 2016. 1. 4..
 */

var DB_handler = require('./DB_handler');

function inquireCheckList(req,res){



    var con = DB_handler.connectDB();
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
        DB_handler.disconnectDB(con);
    });
}


function inquireAllCheckList(req,res){

    var con = DB_handler.connectDB();
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
        DB_handler.disconnectDB(con);
    });
}

function insertCheckList(req,res){

    var con = DB_handler.connectDB();

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
        DB_handler.disconnectDB(con);

    });

}

function modifyCheckList(req,res){


    var con = DB_handler.connectDB();

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
        DB_handler.disconnectDB(con);
    });



}

function deleteCheckList(req,res){

    var con = DB_handler.connectDB();

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
        DB_handler.disconnectDB(con);
    });

}


function inquireALLBadCheckList(req,res){

    var con = DB_handler.connectDB();

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
        DB_handler.disconnectDB(con);
    });
}


function inquireBadCheckList(req,res){
    var con = DB_handler.connectDB();

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
        DB_handler.disconnectDB(con);
    });
}

function insertBadCheckList(req,res){

    var con = DB_handler.connectDB();


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
        DB_handler.disconnectDB(con);
    });

}

function modifyBadCheckList(req,res){


    var con = DB_handler.connectDB();
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
        DB_handler.disconnectDB(con);
    });



}

function deleteBadCheckList(req,res){

    var con = DB_handler.connectDB();

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
        DB_handler.disconnectDB(con);
    });

}


function getRecentGrade(req,res){

    var con = DB_handler.connectDB();

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

        DB_handler.disconnectDB(con);

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

