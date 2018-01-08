var express = require('express');
var router = express.Router();
var UUID = require("uuid");
var Client = require('../service/service_client');
var client = new Client();
var table="spider_Log";

//任务调度执行日志接口API
//增加日志
router.post('/insert', function(req, res, next) {
    var data=req.body;
    data.id=UUID.v1();
    client.insert(table,data,function(result){
        res.send(result);
    });
});
//查询日志
router.post('/select', function(req, res, next) {
    var whereStr=req.body;
    client.select(table,whereStr,function(result){
        res.send(result);
    });
});

module.exports = router;
