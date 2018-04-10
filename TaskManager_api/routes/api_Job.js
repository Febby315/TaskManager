const uuid = require("uuid");
const express = require('express');
const router = express.Router();
const Client = require('../service/service_client');
const client = new Client();
const table="spider_Job";

//增加
router.post('/insert', function(req, res, next) {
	client.insert(table,Object.assign({ id:uuid.v1() },req.body),function(result){
		res.send(result);
	});
});
//删除
router.post('/delete', function(req, res, next) {
	var where = req.body;
    client.delete(table,where,function(result){
        res.send(result);
    });
});
//更新
router.post('/update', function(req, res, next) {
    var where = { id:req.body.id };
    var update = req.body;
    delete update._id,update.id;
    client.update(table,where,{$set:update},function(result){
        res.send(result);
    });
});
//分页查询
router.post('/selectByPage', function(req, res, next) {
    var json = { sort:req.body.sort||{id:1},page:req.body.page||1,size:req.body.pageSize||10,where:req.body.where||{} };
    client.selectByPage(table,json,function(result){
        json['data'] = result||[];
        client.count(table,json.where,function (re) {
            json['total'] = re;
            req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+");"):res.send(json);
        });
    });
});
//条件查询所有
router.post('/selectAll', function(req, res, next) {
    var json = { sort:req.body.sort||{id:1}, where:req.body||{} };
    client.selectAll(table,json,function(result){
        json['data'] = result||[];
        client.count(table,json.where,function (re) {
            json['total'] = re;
            req.body.callback?res.send(req.body.callback+"("+JSON.stringify(json)+");"):res.send(json);
        });
    });
});
//统计
router.post('/count',function(req, res, next) {
    var json = { where:req.body.where||{} };
    client.count(table,json.where,function (re) {
        json['data'] = re;
        res.send(json);
    });
});

module.exports = router;