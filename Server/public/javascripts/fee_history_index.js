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

$.ig.loader({
        scriptPath: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/js/",
        cssPath: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/css/",
        resources: 'modules/infragistics.util.js,' +
        'igGrid,' +
        'modules/infragistics.documents.core.js,' +
        'modules/infragistics.excel.js,' +
        'modules/infragistics.gridexcelexporter.js'
});

getFeeList();

function getFeeList(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        $('.datepicker').val(year+'년 '+month+'월');
        feeList(year, month);
}

$('.datepicker').on('changeDate',function(event){
        var year = event.date.getFullYear();
        var month = event.date.getMonth() + 1;
        feeList(year,month);
});

function feeList(year,month){
        if(month < 10){
                month = '0' + month;
        }
        var date = year +'/'+month;
        var string = '';
        var tfoot = '';
        $.post('/fee/history',{date:date},function(data){
                var rows = data.result;
                var deposit = data.deposit;
                var withdraw = data.withdraw;
                var total = data.total;
                if(rows.length === 0){
                        string += '<tr>';
                        string += '<td colspan=4>';
                        string += '<h4>데이터가 없습니다</h4>';
                        string += '</td>';
                        string += '</tr>';
                        $('.table tfoot').hide();
                }
                else{
                        $('.table tfoot').show();
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
                                        string += '<td class="text-danger">' + row.fm_price.toLocaleString() + '</td>';
                                }
                                else{
                                        string += '<td class="text-primary">' + row.fm_price.toLocaleString() + '</td>';
                                }
                                string += '</tr>';
                        }
                        tfoot += '<tr><td></td><td></td><th>월 수입</th><td class="text-primary">'+ deposit.toLocaleString() + '</td></tr>';
                        tfoot += '<tr><td></td><td></td><th>월 지출</th><td class="text-danger">' + withdraw.toLocaleString() + '</td></tr>';
                        tfoot += '<tr><th colspan = "2">남은 회비</th><th colspan = "2" class="total">'+total.toLocaleString()+'</th></tr>';
                        tfoot += '<tr><td colspan="4"><button id="excelSave" class="btn" type="button">엑셀로 저장</button></td></tr>';
                }
                $('.table tbody').html(string);
                $('.table tfoot').html(tfoot);
        });
}

$('table').on('click','#excelSave',function(){
        var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
        var sheet = workbook.worksheets().add('하드웨어 신청');

        sheet.getCell('A1').value('날짜');
        sheet.getCell('A1').cellFormat().font().height(10*25);
        sheet.getCell('B1').value('구분');
        sheet.getCell('B1').cellFormat().font().height(10*25);
        sheet.getCell('C1').value('내용');
        sheet.getCell('C1').cellFormat().font().height(10*25);
        sheet.getCell('D1').value('금액');

        var i = 2;
        $('table tbody tr').each(function(){
                var arr = new Array();
                $(this).children('td').map(function () {
                        arr.push($(this).text());
                });
                sheet.getCell('A'+i).value(arr[0]);
                sheet.getCell('B'+i).value(arr[1]);
                sheet.getCell('C'+i).value(arr[2]);
                sheet.getCell('D'+i).value(arr[3]);
                i++;
        });
        sheet.getCell('C'+i).value('월 수입');
        sheet.getCell('D'+i).value($('table tfoot tr td.text-primary').html());
        sheet.getCell('C'+(i+1)).value('월 지출');
        sheet.getCell('D'+(i+1)).value($('table tfoot tr td.text-danger').html());
        sheet.getCell('C'+(i+2)).value('남은회비');
        sheet.getCell('D'+(i+2)).value($('table tfoot tr th.total').html());
        var today = new Date();
        var y = today.getFullYear();
        var m = (today.getMonth() + 1);
        saveWorkbook(workbook, y+"년 "+ m + "월 회비입출내역.xlsx");
});

function saveWorkbook(workbook, name) {
        workbook.save({ type: 'blob' }, function (data) {
                saveAs(data, name);
        }, function (error) {
                alert('Error exporting: : ' + error);
        });
}