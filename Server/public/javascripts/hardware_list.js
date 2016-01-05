/**
 * Created by jung-inchul on 2015. 12. 7..
 */
//
toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};
loadHardwarelist();

/*
    Search Normal Hardware list from database named 'datalist'
    Make html string named 'htmlString' to show with table and waiting click event.
 */
function loadHardwarelist(){
    $.post('/hardware/loadHardwarelist', function(datalist){
        var htmlString = settingHTML(datalist);
        $('table#hardwarelist').html(htmlString);
        $('.modal-header').text('하드웨어 대여');
        clickEvent(datalist);
    });
}

function settingHTML(datalist){
    var htmlString = '<tbody>';
    $.each(datalist, function(idx, data){
        if(data.h_remaining === 0){             // #remaining Hardware is not exist
            htmlString += '<tr class="danger"><td>';
            htmlString += '<h6 class="hardwareTitle">' + data.h_name;
            htmlString += '<span class="label label-danger pull-right">' + '0개남음' + '</span></h6></td></tr>'
        }else{
            htmlString += '<tr><td>';
            htmlString += '<h6 class="hardwareTitle">' + data.h_name;
            htmlString += '<span class="label label-success pull-right">' + data.h_remaining + '개남음' + '</span></h6></td></tr>'
        }
    });
    htmlString += '</tbody>';
    return htmlString;
}

/*
    About click event.
    If h_remaining is 0, add 'disabled' class to request button.
    Make modal html string named 'string' and show each hardware's lenders with table.
 */
function clickEvent(datalist){
    $('tr').click(function() {
        var index = $(this).index();        // catch 'index' which user clicked
        var string = '';
        if(datalist[index].h_remaining === 0){      // #remaining Hardware is not exist
            $('#request').addClass('disabled');
            $('#request').removeClass('btn-primary');
            $('#request').addClass('btn-danger');
            $('#request').text('대여불가');
        }else{
            $('#request').removeClass('disabled');
            $('#request').removeClass('btn-danger');
            $('#request').addClass('btn-primary');
            $('#request').text('대여신청');
        }
        string += '<h4 class="bookTitle">' + datalist[index].h_name + '</h4>';
        string += '<p>' + '총 수량 : ' + datalist[index].h_total + '</p><p>남은수량 : ' + datalist[index].h_remaining + '</p>';
        //if(datalist[index].h_serial != null)    string += '<p>시리얼넘버 : ' + datalist[index].h_serial + '</p>';
        $.post('/hardware/lender', {hardware_id: datalist[index].h_id}, function(response){      // Call selected hardware's lenders list
            if(response.length > 0){            // If lenders exist, make list table
                string += '<table class="table table-striped">';
                string += '<tr class="warning"><th>대여자</th><th>대여일</th><th>반납일</th></tr><tbody>';
                for(var i = 0; i < response.length; i++){
                    string += '<tr><td>' + response[i].u_name + '</td><td>' + response[i].hr_rental_date + '</td><td>' + response[i].hr_due_date + '</td></tr>';
                }
                string += '</tbody>';
            }
            $('div.modal-body').html(string);
            $('button#request').unbind().click(function(){
                if(datalist[index].h_remaining != 0){
                    $.post("/hardware/borrow", {hardware_id: datalist[index].h_id}, function(response){
                        if(response === 'success')  toastr['success']('대여신청 성공');
                        else    toastr['error']('대여신청 실패');
                        loadHardwarelist();
                    });        // borrow hardware
                    $('div.modal').modal('hide');
                    //window.location.reload();
                }
            });
            $('div.modal').modal();
        });
    });
}