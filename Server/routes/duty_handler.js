/**
 * Created by HyunJae on 2015. 12. 20..
 */



function loadMyDuty(con,req,res){

    var id = req.session.passport.user.id;

    var currentDate = new Date();
    var month = currentDate.getMonth()+1;
    var year = currentDate.getFullYear();
    var query = "select * from swmem.t_duty where user_id1 = " + id + " or user_id2 = " + id + " or user_id3 = " + id + " or user_id4 = " + id
        + " and month(date)= " + month + " and year(date) = " + year;

    con.query(query, function(err, response){


        var datas =[];

        for (var i=0;i<response.length;i++){
            var row = response[i];
            datas[i] ={};
            datas[i].month = row.date.getMonth() + 1;
            datas[i].date = row.date.getDate();

            if(row.user_id1 == id){
                datas[i].type = row.user1_mode;
            }

            else if(row.user_id2 == id){
                datas[i].type = row.user2_mode;
            }else if(row.user_id3 == id){
                datas[i].type = row.user3_mode;
            }else if(row.user_id4 == id){
                datas[i].type = row.user4_mode;
            }else{
                datas[i].type = 0;
                console.log("type error!");
            }

        }

        res.send(datas);
        console.log(datas);
    });


}

function getUser(con, req, res){
    var id = req.session.passport.user.id;
    var name = req.session.passport.user.name;

    var data = {};
    data.id = id;
    data.name = name;
    res.send(data);

}


function loadNormalHardware(con, req, res){
    var query = 'select * from t_hardware where h_type=0';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadSpecialHardware(con, req, res){
    var query = 'select * from t_hardware where h_type=1';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function borrowHardware(con, req, res){
    var query1 = 'insert into t_hardware_rental SET ?';
    var dataset = {
        hr_user : req.session.passport.user.id,
        hr_hardware_id : req.body.hardware_id,
        hr_rental_date : getDate(new Date(), 0),
        hr_due_date : getDate(new Date(), 14)
    };
    con.query(query1, dataset);
    var query2 = 'update t_hardware set h_remaining=h_remaining-1 where h_id="'+req.body.hardware_id+'"';
    con.query(query2);
}

function loadLender(con, req, res){
    var query = 'select * from t_user a join t_hardware_rental b on a.u_id=b.hr_user where b.hr_hardware_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turnInHardware(con, req, res){
    var query1 = 'update t_hardware set h_remaining=h_remaining+1 where h_id="' + req.body.hardware_id + '"';
    con.query(query1);
    var query2 = 'insert into t_hardware_return SET ?';
    var dataset = {
        ht_user : req.session.passport.user.id,
        ht_hardware_id: req.body.hardware_id,
        ht_rental_date: req.body.rental_date,
        ht_return_date: getDate(new Date(), 0)
    };
    con.query(query2, dataset);
    var query3 = 'delete from t_hardware_rental where hr_id="' + req.body.rental_id + '"';
    con.query(query3);
}

function postponeHardware(con, req, res){
    var changed_date = getDate(req.body.due_date, 14);
    var query = 'update t_hardware_rental set hr_extension_cnt=hr_extension_cnt+1, hr_due_date="' + changed_date + '" where hr_id="' + req.body.rental_id + '"';
    con.query(query);
}

function loadMynormalHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=0 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadMyspecialHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=1 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate());
    return date;
}


exports.loadMyDuty = loadMyDuty;
exports.getUser = getUser;

exports.postponeHardware = postponeHardware;
exports.loadLender = loadLender;
exports.turnInHardware = turnInHardware;
exports.loadMynormalHardware = loadMynormalHardware;
exports.loadMyspecialHardware = loadMyspecialHardware;
exports.borrowHardware = borrowHardware;
exports.loadSpecialHardware = loadSpecialHardware;
exports.loadNormalHardware = loadNormalHardware;