const 
    cp = require('child_process'),
    moment = require('moment-timezone'),
    fs = require('fs');

var 
    stockData = JSON.parse(fs.readFileSync('data/stockList.json')), // Read all stock data to an array
    stockDataIndex = 0;

/* Main function */
function run(){
    /* Set up data */
    stockDataIndex = 0;
    let tarDate = new Date(Date.now()); // The date we want to request
    let tarDateStr = DateToStr(tarDate);
    // tarDateStr = "20180927";

    RequestSingleStock(stockData[stockDataIndex]['symbol'].toString(), tarDateStr);
}

/* Request a single stock's data for a soecific date */
function RequestSingleStock(symbol, tarDateStr) {


    console.log('=============================');
    console.log(`${moment().tz('Asia/Taipei').format('YYYY-MM-DD hh:mm:ss zz')}`);
    console.log(stockDataIndex + '/' + (stockData.length-1) +' of all stocks...');
    console.log('Processing ' + symbol + ' ...');

    /* Produce a child process */
    var cmd = 'node singleTick.js ' + symbol + ' ' + tarDateStr;
    var singleTick = cp.exec(cmd, {timeout : 15000}); // This child process will timeout after 15 sec
    console.log('Create child process "' + cmd +  '"' );

    /* Log out process */
    singleTick.stdout.on('data', function (data) {
        console.log(data);
    });
    singleTick.stderr.on('data', function (data) {
        console.log(data);
    });
    
    /* Continue to do next stock, even if error */
    singleTick.on('exit', function (code) {

        console.log('child process exited with code ' + code);
        console.log('Finish processing for ' + symbol + '...');
        console.log(`${moment().tz('Asia/Taipei').format('YYYY-MM-DD hh:mm:ss zz')}`);
        console.log('=============================');
        
        /* Do next stock */
        /* Continue only if we haven't done */
        stockDataIndex++;
        if(stockDataIndex<stockData.length)
        {
            RequestSingleStock(stockData[stockDataIndex]['symbol'].toString(), tarDateStr);
        }
        /* Exit process */
        else
        {
            console.log('Fininsh inserting all data');
        }
    });
}

/* Convert date obj to fugle desired format */
function DateToStr(tarDate) {
    var Yr = (tarDate.getFullYear()).toString();
    var Mn = (tarDate.getMonth()+1 < 10) ? '0' + (tarDate.getMonth()+1).toString() : (tarDate.getMonth()+1).toString();
    var Dy = (tarDate.getDate()  < 10) ? '0' + (tarDate.getDate()).toString()  : (tarDate.getDate()).toString();
    return  Yr + Mn + Dy;
}

module.exports = {
    run : run
};