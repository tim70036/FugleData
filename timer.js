const 
    CronJob = require('cron').CronJob,
    moment = require('moment-timezone'),
    allTick = require('./allTick');

console.log('Before cron job instantiation');

// '00 15 * * 1-5'

let option = {
	cronTime : '00 15 * * 1-5',
	timeZone : 'Asia/Taipei',
	onTick : scheduledTask
};

const job = new CronJob(option);

console.log('After cron job instantiation');
job.start();

function scheduledTask(){
    console.log(`Cron job start at ${moment().tz('Asia/Taipei').format('YYYY-MM-DD hh:mm:ss zz')}`);
    allTick.run();
    console.log(`Cron job end at ${moment().tz('Asia/Taipei').format('YYYY-MM-DD hh:mm:ss zz')}`);
}


