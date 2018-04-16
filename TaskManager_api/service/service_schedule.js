const moment = require('moment');
const schedule = require('node-schedule');
const spawn = require('child_process').spawn;
const df="YYYY-MM-DD HH:mm:ss.SSS";


let service={};
service.map={};
//开始运行
service.start=function(task,callback) {
    console.log("%s Task Start-->>%s(%s)",moment().format(df),task['taskName'],task['id']);
    if(!service.map[task.id]){
        service.map[task.id]=schedule.scheduleJob(task.cron,callback);
    }
};
//停止运行
service.stop=function(task,callback){
    let succeed=false;
    if(service.map[task.id]){
        succeed = service.map[task.id].cancel();
        delete service.map[task.id];
    }
    console.log("%s Task Stop-->>%s(%s)-->%s",moment().format(df),task.taskName,task.id,succeed?"SUCCESSS":"FAIL");
    callback(succeed);
}
//检查运行状态
service.checkTasks=function(tasks,callback){
    tasks.forEach(function (task,index) {
        tasks[index].state=service.map[task.id]?1:0;
    });
    callback(tasks);
}
//判断运行
service.isRun=function(task){
    return service.map[task.id]?true:false;
}
//运行作业
service.runJob=function(job,callback){
    let command=job['command'];
    let params=JSON.parse(job['params']||{});
    let startDate=new Date();
    let ls = spawn(command,params);
    console.log("%s [%s]Job Running-->%s\t%s %s",moment().format(df),ls.pid,job['jobName'],job['command'],params.join(" "));
    ls.stdout.on('data', function(msg){
        console.log("%s [%s]Job Stdout-->%s",moment().format(df),ls.pid,job['jobName'],msg.toString());
    });
    ls.stderr.on('data', function(err){
        console.log("%s [%s]Job Stderr-->%s\t\n%s",moment().format(df),ls.pid,job['jobName'],err.toString());
    });
    ls.on('close', function(code){
        console.log("%s [%s]Job Closed-->%s\t%s\t耗时:%sms",moment().format(df),ls.pid,job['jobName'],code,new Date()-startDate);//0:正常退出,!0:异常退出
    });
    callback?callback(ls):"";
}

module.exports = service;