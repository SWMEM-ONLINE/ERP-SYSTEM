/**
 * Created by KIMDONGWON on 2015-11-27.
 */
$('#push-equipment').on('click', function () {
    $.post('/apply/equipment/complete');
});

$('#push-room').on('click', function () {
    $.post('/apply/room/complete');
});

$('#push-server').on('click', function () {
    $.post('/apply/server/complete');
});