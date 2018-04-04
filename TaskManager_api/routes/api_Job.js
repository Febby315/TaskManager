const uuid = require("uuid");
const express = require('express');
const router = express.Router();
const Client = require('../service/service_client');
const client = new Client();
const table="spider_Job";

//增加
router.post('/insert', function(req, res, next) {
	var data=req.body;
	data.id=uuid.v1();
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
router.post('/update', function(req, res, next) {
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
        if(!err){json['total']=result;}
    });
    client.selectByPage(table,json,function(result){
        json['data']=result||[];
        req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+");"):res.send(json);
    });
});
//条件查询所有
router.post('/selectAll', function(req, res, next) {
    var json={};
    json['sort']=req.body.sort||{id:1};
    json['where']=req.body||{};
    client.count(table,json['where'],function (err,result) {
        if(!err){json['total']=result;}
    });
    client.selectAll(table,json,function(result){
        json['data']=result||[];
        req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+");"):res.send(json);
    });
});
//统计
router.post('/count',function(req, res, next) {
    var json={};
    json['where']=req.body.where||{};
    client.count(table,json['where'],function (err,result) {
        if(!err){ json['data']=result; }
        res.send(json);
    });
});

module.exports = router;
