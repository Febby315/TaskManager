/**
 * Created by admin on 2017/5/2.
 */
var express = require('express');
var router = express.Router();
var UUID = require("uuid");
var Client = require('../service/service_client');
var Schedule = require('../service/service_schedule');
var client = new Client();
var table='spider_Task';


//增加
router.post('/insert', function(req, res, next) {
    var data=req.body;
    data.id=UUID.v1();
    client.insert(table,data,function(result){
        res.send(result);
    });
});
//删除
router.post('/delete', function(req, res, next) {
    var whereStr=req.body;
    client.delete(table,whereStr,function(result){
        res.send(result);
    });
});
//更新
router.post('/update',function(req, res, next) {
    var whereStr={id:req.body.id};
    var updateStr=req.body;
    delete updateStr.id;
    client.update(table,whereStr,{$set:updateStr},function(result){
        res.send(result);
    });
});
//分页查询
router.post('/selectByPage', function(req, res, next) {
    var json={};
    json['sort']=req.body.sort||{id:1};
    json['page']=req.body.page||1;
    json['size']=req.body.pageSize||10;
    json['where']=req.body.where||{};
    client.count(table,json['where'],function (err,result) {
        if(!err){ json['total']=result;}
    });
    client.selectByPage(table,json,function(result){
        Schedule.checkTasks(result,function (tasks) {
            json['data']=tasks||[];
            req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+")"):res.send(json);
        });
    });
});
//条件查询所有
router.post('/select', function(req, res, next) {
    var json={};
    json['sort']=req.body.sort||{id:1};
    json['where']=req.body||{};
    client.count(table,json['where'],function (err,result) {
        if(!err){ json['total']=result;}
    });
    client.selectAll(table,json,function(result){
        Schedule.checkTasks(result,function (tasks) {
            json['data']=tasks||[];
            req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+")"):res.send(json);
        });
    });
});
//统计
router.post('/count', function(req, res, next) {
    var json={};
    json['where']=req.body.where||{};
    client.count(table,json['where'],function (err,result) {
        if(!err){json['data']=result;}
        res.send(json);
    });
});

//运行
router.post('/run', function(req,res, next) {
    var json={};
    json['where']=req.body;
    var jobTable="spider_Job"
    client.selectAll(table,json,function(taskResult){
        taskResult.forEach(function (task,index) {
            client.selectAll(jobTable,{where:{taskId:task['id']}},function (jobResult) {
                Schedule.start(task,function () {
                    console.log("Running Task:"+task['taskName']+"\t["+task['id']+"]",new Date().format("yyyy-MM-dd hh:mm:ss.S"));
                    jobResult.forEach(function (job,jobIndex) {
                        Schedule.runJob(job);
                    });
                });
            });
        });
        res.send(taskResult);
    });
});
//运行一次
router.post('/runOne', function(req, res, next) {
    var json={};
    json['where']=req.body;
    var jobTable="spider_Job";
    client.selectAll(table,json,function(taskResult){
        taskResult.forEach(function (task,index) {
            client.selectAll(jobTable,{where:{taskId:task['id']}},function (jobResult) {
                console.log("Running Task:"+task['taskName']+"\t["+task['id']+"]",new Date().format("yyyy-MM-dd hh:mm:ss.S"));
                jobResult.forEach(function (job,jobIndex) {
                    Schedule.runJob(job);
                });
            });
        });
        res.send(taskResult);
    });
});
//停止
router.post('/stop', function(req, res, next) {
    var json={};
    json['where']=req.body;
    client.selectAll(table,json,function(result){
        result.forEach(function (task,index) {
            Schedule.stop(task,function (succeed) {
            });
        });
        res.send(result);
    });
});

module.exports = router;


