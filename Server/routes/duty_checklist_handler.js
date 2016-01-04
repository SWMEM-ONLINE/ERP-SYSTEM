/**
 * Created by HyunJae on 2016. 1. 4..
 */


function inquireCheckList(con,req,res){

    var type = req.body.type;
    var table = "";

    if(type == "normal")
    {
        table = "t_duty_checklist";
    }
    else
    {
        table = "t_duty_bad_checklist";
    }

    var query = "SELECT * FROM swmem." + table + ";";

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


    var type = req.body.type;
    var grade = req.body.grade;
    var section = req.body.section;
    var content = req.body.content;

    type ="normal";
    grade = "A";
    section = "asdf";
    content = "asdfasdfsd";

    var table = "";

    if(type == "normal")
    {
        table = "t_duty_checklist";
    }
    else
    {
        table = "t_duty_bad_checklist";
    }

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


    var type = req.body.type;
    var grade = req.body.grade;
    var section = req.body.section;
    var content = req.body.content;
    var index = req.body.index;

    type ="normal";
    grade = "A";
    section = "asdf";
    content = "asdfasdfsd";
    index = "1";

    var table = "";

    if(type == "normal")
    {
        table = "t_duty_checklist";
    }
    else
    {
        table = "t_duty_bad_checklist";
    }

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

    var type = req.body.type;
    var index = req.body.index;

    type ="normal";
    index = 1;

    var table = "";

    if(type == "normal")
    {
        table = "t_duty_checklist";
    }
    else
    {
        table = "t_duty_bad_checklist";
    }

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

exports.inquireCheckList = inquireCheckList;
exports.insertCheckList = insertCheckList;
exports.modifyCheckList = modifyCheckList;
exports.deleteCheckList = deleteCheckList;