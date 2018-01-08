var schedule = require('node-schedule');
var spawn = require('child_process').spawn;

var service={};
service.map={};
service.start=function(task,callback) {
    console.log("Start Task "+task['taskName']+"("+task['id']+")",new Date().format("yyyy-MM-dd hh:mm:ss.S"));
    if(!service.map[task.id]){
        service.map[task.id]=schedule.scheduleJob(task.cron,callback);
    }
};
service.stop=function(task,callback){
    var succeed=false;
    if(service.map[task.id]){
        succeed=service.map[task.id].cancel();
        delete service.map[task.id];
    }
    console.log("Stop Task "+task.taskName+"("+task.id+")-->"+(succeed?"SUCCESSS":"FAIL"),new Date().format("yyyy-MM-dd hh:mm:ss.S"));
    callback(succeed);
}
service.checkTasks=function(tasks,callback){
    tasks.forEach(function (task,index) {
        tasks[index].state=service.map[task.id]?1:0;
    });
    callback(tasks);
}
service.isRun=function(task){
    return service.map[task.id]?true:false;
}
service.runJob=function(job,callback){
    var command=job['command'];
    var params=JSON.parse(job['params']||{});
    var startDate=new Date();
    var ls = spawn(command,params);
    console.log("Running Job-->"+ls.pid+":"+job['jobName']+"\t"+job['command'],startDate.format("yyyy-MM-dd hh:mm:ss.S"));
    ls.stdout.on('data', function(data){
        console.log(job['jobName']+"-Stdout>\n"+data+"",ls.pid);
    });
    ls.stderr.on('data', function(data){
        console.log(job['jobName']+"-Stderr>\n"+data+"",ls.pid);
    });
    ls.on('close', function(code){
        var endDate=new Date();
        console.log("Closed Job-->"+ls.pid+":"+job['jobName']+"\t"+code+"\t耗时:"+(endDate-startDate)+"ms",endDate.format("yyyy-MM-dd hh:mm:ss.S"));//0:正常退出,!0:异常退出
    });
    callback?callback(ls):"";
}

module.exports = service;