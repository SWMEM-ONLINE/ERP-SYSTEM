$('.datepicker').datepicker({
        format: "yyyy년 m월",
        minViewMode: 1,
        keyboardNavigation : false,
        todayHighlight: true,
        startView: 1,
    //    startDate: new Date(2014, 0, 1),
        endDate: '+1d',
        autoclose: true
});

$('.datepicker').on('changeDate',function(event){
        var year = event.date.getFullYear();
        var month = event.date.getMonth() + 1;
        if(month < 10){
                month = '0' + month;
        }
        var date = year +'/'+month;
        var string = '';
        $.post('/fee/history',{date:date},function(data){
                var rows = data.result;
                if(rows.length === 0){
                        string += '<tr>';
                        string += '<td colspan=4>';
                        string += '<h3>데이터가 없습니다</h3>';
                        string += '</td>';
                        string += '</tr>';
                }
                else{
                        for(var i=0;i<rows.length;i++){
                                var row = rows[i];
                                string += '<tr>';
                                string += '<td>'+ row.fm_date + '</td>';
                                if(row.fm_money_type === 1){
                                        string += '<td class="text-danger">지출</td>';
                                }
                                else{
                                        string += '<td class="text-primary">수입</td>';
                                }
                                string += '<td>'+row.fm_money_content+'</td>';
                                if(row.fm_money_type === 1){
                                        string += '<td class="text-danger">' + row.fm_price + '</td>';
                                }
                                else{
                                        string += '<td class="text-primary">' + row.fm_price + '</td>';
                                }
                                string += '</tr>';
                        }
                }
                $('.table tbody').html(string);
        });
});