/**
 * Created by KIMDONGWON on 2015-11-27.
 */
$('#push-equipment').on('click', function () {
    if(!$('.push-equipment').hasClass('disabled')) {
        $.post('/apply/equipment/complete');
    }
});

$('.push-room').on('click', function () {
    if(!$('.push-room').hasClass('disabled')){
        $.post('/apply/room/complete');
    }
});

$('#push-server').on('click', function () {
    if(!$('.push-server').hasClass('disabled')) {
        $.post('/apply/server/complete');
    }
});