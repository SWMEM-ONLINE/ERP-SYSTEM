/**
 * Created by KIMDONGWON on 2015-12-17.
 */

var thisPage;
var FEE_MANAGE_ALL = '/fee/manage/all';  //1
var FEE_MANAGE_FEE = '/fee/manage/fee';  //2
var FEE_MANAGE_SSF = '/fee/manage/ssf';  //3
var FEE_MANAGE_ETC = '/fee/manage/etc';  //4

if(location.pathname == FEE_MANAGE_ALL){
    thisPage = 1;
}
else if(location.pathname == FEE_MANAGE_FEE){
    thisPage = 2;
}
else if(location.pathname == FEE_MANAGE_SSF){
    thisPage = 3;
}
else if(location.pathname == FEE_MANAGE_ETC){
    thisPage = 4;
}

getList(thisPage);

function getList(thisPage){
    $('#memberList thead').empty();
    $('#memberList tbody').empty();

    var theadString = '';
    var tbodyString = '';

    if(thisPage === 1){
        theadString += '<tr><td colspan="5">기수 / 이름</td></tr>';
        $('#memberList thead').append(theadString);
    }
    else if(thisPage === 2) {
        theadString += '<tr><td colspan="5"></td></tr>';
    }
    else if(thisPage === 3) {

    }
    else if(thisPage === 4) {

    }
}