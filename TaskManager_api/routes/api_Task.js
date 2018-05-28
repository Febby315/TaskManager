/**
 * Created by admin on 2017/5/2.
 */
const uuid = require("uuid");
const moment = require('moment');
const express = require('express');
const router = express.Router();
const Client = require('../service/service_client');
const Schedule = require('../service/service_schedule');
const client = new Client();
const table = 'spider_task';
const jobTable = "spider_job";

//增加
router.post('/insert', function(req, res, next) {
    let data = Object.assign({},req.body,{ id:uuid.v1() });
    client.insert(table,data,function(result){
        res.send(result);
    });
});
//删除
router.post('/delete', function(req, res, next) {
    let where = Object.assign({},req.body);
    client.delete(table,where,function(result){
        res.send(result);
    });
});
//更新
router.post('/update',function(req, res, next) {
    let where = { id:req.body.id };
    let update = req.body;
    delete update._id,delete update.id;//删除_id,id;
    client.update(table,where,{$set:update},function(result){
        res.send(result);
    });
});
//分页查询
router.all('/selectByPage', function(req, res, next) {
    let json = Object.assign({ sort:{id:1},page:1,size:10,where:{} },req.body);
    console.log(req.body,json)
    client.selectByPage(table,json,function(result){
        Schedule.checkTasks(result,function (tasks) {
            json['data'] = tasks||[];
        });
        client.count(table,json['where'],function (re) {
            json['total'] = re;
            req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+")"):res.send(json);
        });
    });
});
//条件查询所有
router.post('/select', function(req, res, next) {
    let json = Object.assign({ sort:{id:1},where:{} },req.body);
    client.selectAll(table,json,function(result){
        Schedule.checkTasks(result,function (tasks) {
            json['data'] = tasks||[];
        });
        client.count(table,json['where'],function (re) {
            json['total'] = re;
            req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+")"):res.send(json);
        });
    });
});
//统计
router.post('/count', function(req, res, next) {
    let json = Object.assign({ where:{} },req.body);
    client.count(table,json['where'],function (re) {
        json['data'] = re;
        res.send(json);
    });
});
//运行
router.post('/run', function(req, res, next) {
    let json = Object.assign({ where:{} },req.body);
    client.selectAll(table,json,function(taskResult){
        taskResult.forEach(function (task,index) {
            client.selectAll(jobTable,{where:{taskId:task['id']}},function (jobResult) {
                Schedule.start(task,function () {
                    console.log("%s Running Task:%s\t[%s]",moment().format("YYYY-MM-DD HH:mm:ss.SSS"),task['taskName'],task['id']);
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
    let json = Object.assign({ where:{} },req.body);
    client.selectAll(table,json,function(taskResult){
        taskResult.forEach(function (task,index) {
            client.selectAll(jobTable,{where:{taskId:task['id']}},function (jobResult) {
                console.log("%s Running Task:%s\t[%s]",moment().format("YYYY-MM-DD HH:mm:ss.SSS"),task['taskName'],task['id']);
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
    let json = Object.assign({ where:{} },req.body);
    client.selectAll(table,json,function(result){
        result.forEach(function (task,index) {
            Schedule.stop(task,function (succeed) {
            });
        });
        res.send(result);
    });
});
//自动运行
// (function(){
//     let json = { where:{ autorun:"1" }};
//     client.selectAll(table,json,function(taskResult){
//         taskResult.forEach(function (task,index) {
//             client.selectAll(jobTable,{where:{taskId:task['id']}},function (jobResult) {
//                 Schedule.start(task,function () {
//                     console.log("%s Running Task:%s\t[%s]",moment().format("YYYY-MM-DD HH:mm:ss.SSS"),task['taskName'],task['id']);
//                     jobResult.forEach(function (job,jobIndex) {
//                         Schedule.runJob(job);
//                     });
//                 });
//             });
//         });
//     });
// })();

module.exports = router;