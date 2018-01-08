var config = require("../config/config.json");
var MongoClient = require("mongodb").MongoClient;
var DB_CONN_STR = config.mongodb;

function init_db(callback){
    MongoClient.connect(DB_CONN_STR,function(err,db){
        err?console.log(err):callback(db);
        db.close();
    });
}
function resultCheck(err,result,callback){
    err?console.log(err):callback(result);
}
var service=function(){
    self=this;
    this.insert=function(table,data,callback){
        init_db(function (db) {
            var collection = db.collection(table);
            collection.insert(data,function (err,result){
                resultCheck(err,result,callback)
            });
        });
    }
    this.delete=function(table,whereStr,callback){
        init_db(function (db) {
            var collection = db.collection(table);
            collection.remove(whereStr,function (err,result){
                resultCheck(err,result,callback)
            });
        });
    }
    this.update=function(table,whereStr,updateStr,callback){
        init_db(function (db) {
            var collection = db.collection(table);
            collection.update(whereStr,updateStr,function (err,result){
                resultCheck(err,result,callback)
            });
        });
    }
    //分页查询
    this.selectByPage=function(table,json,callback){
        var sort=json.sort;
        var page=parseInt(json.page,10);
        var size=parseInt(json.size,10);
        var where=json.where;
        console.log(json);
        init_db(function (db) {
            var collection = db.collection(table);
            collection.find(where).sort(sort).skip((page-1)*size).limit(size).toArray(function (err,result){
                if(!err){
                    resultCheck(err,result,callback)
                }
            });
        });
    }
    //查询所有
    this.selectAll=function(table,json,callback){
        var sort=json.sort||{id:1};
        var where=json.where;
        init_db(function (db) {
            var collection = db.collection(table);
            collection.find(where).sort(sort).toArray(function (err,result){
                if(!err){
                    resultCheck(err,result,callback)
                }
            });
        });
    }
    this.count=function(table,where,callback){
        init_db(function (db) {
            var collection = db.collection(table);
            collection.count(where,function (err,result){
                callback(err,result);
            });
        });
    }
}
module.exports = service;
