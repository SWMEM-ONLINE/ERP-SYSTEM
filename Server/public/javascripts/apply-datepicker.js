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
