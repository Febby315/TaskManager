const MongoClient = require("mongodb").MongoClient;
const config = require("../config/config.json");
const DB_CONN_STR = config.mongodb;

//初始化DB
function init_db(callback){
    MongoClient.connect(DB_CONN_STR,function(err,db){
        err?console.error(err):callback(db);
        db.close();
    });
}
//处理异常
function resultCheck(err,result,callback){
    err?console.error(err):callback(result);
}

//数据库操作接口
let service=function(){
    self = this;
    //新增
    self.insert=function(table,data,callback){
        init_db(function (db) {
            db.collection(table).insert(data,function (err,result){
                resultCheck(err,result,callback);
            });
        });
    }
    //删除
    self.delete=function(table,where,callback){
        init_db(function (db) {
            db.collection(table).remove(where,function (err,result){
                resultCheck(err,result,callback);
            });
        });
    }
    //更新
    self.update=function(table,where,updateStr,callback){
        init_db(function (db) {
            db.collection(table).update(where,updateStr,function (err,result){
                resultCheck(err,result,callback);
            });
        });
    }
    //分页查询
    self.selectByPage=function(table,json,callback){
        let page=parseInt(json.page,10);
        let size=parseInt(json.size,10);
        init_db(function (db) {
            db.collection(table).find(json.where).sort(json.sort).skip((page-1)*size).limit(size).toArray(function (err,result){
                resultCheck(err,result,callback);
            });
        });
    }
    //查询所有
    self.selectAll=function(table,json,callback){
        init_db(function (db) {
            db.collection(table).find(json.where).sort(json.sort).toArray(function (err,result){
                resultCheck(err,result,callback);
            });
        });
    }
    //统计
    self.count=function(table,where,callback){
        init_db(function (db) {
            db.collection(table).count(where,function (err,result){
                resultCheck(err,result,callback);
            });
        });
    }
}
module.exports = service;
