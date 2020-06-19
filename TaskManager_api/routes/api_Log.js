const uuid = require("uuid");
const express = require('express');
const router = express.Router();
const Client = require('../service/service_client');
const client = new Client();
const table = "spider_log";

//任务调度执行日志接口API
//增加日志
router.post('/insert', function (req, res, next) {
	let data = req.body;
	data.id = uuid.v1();
	client.insert(table, data, function (result) {
		res.send(result);
	});
});
//查询日志
router.post('/select', function (req, res, next) {
	let whereStr = req.body;
	client.select(table, whereStr, function (result) {
		res.send(result);
	});
});

module.exports = router;
