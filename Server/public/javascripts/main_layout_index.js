/**
 * Created by jung-inchul on 2016. 1. 3..
 */

//checkuserGrade();
//
//function checkuserGrade(){
//    $.post('/main/getUserpermission', function(grade){
//        switch(grade[0].u_state){
//            case 1:                             // 운영자
//            case 2:                             // 회장
//                $('ul.dropdown-menu li.manage').removeClass('hidden');
//                break;
//            case 3:                             // 총무
//                $('ul.dropdown-menu li.fee').removeClass('hidden');
//                break;
//            case 4:                             // 자재부장
//                $('ul.dropdown-menu li.book').removeClass('hidden');
//                break;
//            case 5:                             // 생활장
//            case 6:                             // 세미나장
//                $('ul.dropdown-menu li.projectroom').removeClass('hidden');
//                break;
//            case 7:                             // 문화장
//            case 8:                             // 네트워크장
//                $('ul.dropdown-menu li.server').removeClass('hidden');
//                break;
//            case 9:                             // 교육장
//            default:
//        }
//    });
//}