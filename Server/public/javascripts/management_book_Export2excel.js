/**
 * Created by jung-inchul on 2015. 11. 26..
 */

var excel = require('node-excel-export');   // https://github.com/andreyan-andreev/node-excel-export
var DBhandler = require('../../DB_handler');
var fs = require('fs');

/*
 *  Setting excel cell style.
 *  Detail options can be found in 'https://github.com/protobi/js-xlsx#cell-styles'
 */
var styles = {
    headerDark: {                   // header cell
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 12,
            bold: true,
            underline: true
        },
        alignment:{
            horizontal:'center'
        }
    },
    cellBlue: {                     // blue cell
        fill: {
            fgColor: {
                rgb: '92FFFF'
            }
        },
        font:{
            name:'나눔고딕',
            bold: true,
            sz: 12
        },
        alignment:{
            horizontal:'center',
            wrapText: true
        }
    },
    etc: {                          // etc cell
        font:{
            name:'나눔고딕',
            bold: true,
            sz: 12
        },
        alignment:{
            horizontal:'center',
            wrapText: true
        }
    }
};

/*
 *  Setting cell name and apply style settings.
 */
var specification = {
    bookName: {
        displayName: '도서명',
        headerStyle: styles.headerDark,
        cellStyle: styles.cellBlue
    },
    author: {
        displayName: '저자',
        headerStyle: styles.headerDark,
        cellStyle: styles.etc
    },
    publisher: {
        displayName: '출판사',
        headerStyle: styles.headerDark,
        cellStyle: styles.etc
    }
};

var con = DBhandler.connectDB();
var query = 'SELECT * FROM bookList';

con.query(query, function(err, response) {
    var dataset = [];

    for (var i = 0; i < response.length; i++) {
        dataset.push({
            bookName: response[i].b_name,
            author: response[i].b_author,
            publisher: response[i].b_publisher
        });
    }

    var date = new Date();
    var month = date.getMonth() + 1;
    var fileName = month + '월 도서신청목록.xlsx';

    /*
     *  Build excel file with dataset.
     */
    var report = excel.buildExport(
        [
            {
                name: '도서신청목록',
                specification: specification,
                data: dataset
            }
        ]
    );
    fs.writeFileSync(fileName, report);
    DBhandler.disconnectDB(con);                    // Disconnect database
});