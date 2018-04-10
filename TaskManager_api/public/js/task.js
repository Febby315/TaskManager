//定义任务
function Task(){
    let self=this;
    self.data={};
    self.run = function(d){
        sendComm("POST","/api/api_task/run",{ where:{ id: d.id } },function(re){
            let title=`运行`,content=`运行任务(${d.id})命令发送成功<br>${ JSON.stringify(re) }`;
            layer.open({ title:title, content:content, end:loadTask(task.page) });
        });
    };
    self.stop = function(d){
        layer.confirm('确认停止运行？', function(index){
            layer.close(index);
            sendComm("POST","/api/api_task/stop",{ where:{ id: d.id } },function(re){
                let title=`停止`,content=`停止任务(${d.id})命令发送成功<br>${ JSON.stringify(re) }`;
                layer.open({ title:title, content:content, end:loadTask(task.page) });
            });
        });
    };
    self.runOnce = function(d){
        sendComm("POST","/api/api_task/runOne",{ where:{ id: d.id } },function(re){
            let title=`运行一次`,content=`运行一次(${d.id})命令发送成功<br>${ JSON.stringify(re) }`;
            layer.open({ title:title, content:content });
        });
    };
    self.ins = function(d){
        let idx=layer.open({
            type: 1,
            title:`新增`,
            area: ['640px', 'auto'],
            fixed: false, //不固定
            maxmin: true,
            content: template("task_add",d)
        });
        //监听提交事件
        layui.form.on('submit(task_add)', function(data){
            sendComm($(data.form).attr("method"),$(data.form).attr("action"),data.field,function(re){
                layer.close(idx);
                let title=`新增`,content=`新增(${d.id})命令发送成功<br>${ JSON.stringify(re) }`;
                layer.open({ title:title, content:content, end:loadTask(task.page) });
            });
            return false;
        });
    };
    self.upd = function(d){
        let idx=layer.open({
            type: 1,
            title:`修改`,
            area: ['640px', 'auto'],
            fixed: false, //不固定
            maxmin: true,
            content: template("task_edit",d)
        });
        //监听提交事件
        layui.form.on('submit(task_edit)', function(data){
            sendComm($(data.form).attr("method"),$(data.form).attr("action"),data.field,function(re){
                layer.close(idx);
                let title=`修改`,content=`修改(${d.id})命令发送成功<br>${ JSON.stringify(re) }`;
                layer.open({ title:title, content:content, end:loadTask(task.page) });
            });
            return false;
        });
    };
    self.del = function(d){
        layer.confirm('真的删除行么？', function(index){
            layer.close(index);
            sendComm("POST","/api/api_task/delete",{ id: d.id },function(re){
                let title=`删除`,content=`删除(${d.id})命令发送成功<br>${ JSON.stringify(re) }`;
                layer.open({ title:title, content:content, end:loadTask(task.page) });
            });
        });
    };
}

//初始化表格
function initList(data){
    var task = window.task = new Task();
    var option = task.option = {
        info: false,
        paging:false,
        searching:false,
        deferRender: true,
        columns:[
            {
                data:'_id', 
                title:'<input id="selectAll" type="checkbox"/>全选',
                orderable:false,
                className:'col-center',
                width:50,
                render:function(d, t, r, m){ return `<input type="checkbox" value="${d}"/>`; }
            },
            { data:'id', title:'ID', className:'col-center', width:240 },
            { data:'taskName', title:'任务名称', width:240 },
            { data:'cron', title:'cron表达式', width:100 },
            { data:'state', title:'状态', width:50 },
            { data:'remark', title:'备注' },
            {
                data:'id',
                title:'操作',
                orderable:false,
                className:'col-center',
                render:function(d, t, r, m){
                    let className="layui-btn layui-btn-xs";
                    return `<div class="layui-btn-group">`+
                        `<button class="${className}" data-type="${!!r.state?"stop":"run"}" >${!!r.state?"停止":"运行"}</button>`+
                        `<button class="${className} layui-btn-warm" data-type="upd">修改</button>`+
                        `<button class="${className} layui-btn-danger"" data-type="del">删除</button>`+
                        `<button class="${className} layui-btn-normal" data-type="runOnce">一次</button>`+
                    `</div>`;
                }
            }
        ]
    };
    var table = task.table = $('#list').DataTable(option);
    //全选框单击事件
    $("#selectAll").on("click",function(){
        $("input:checkbox").prop("checked",$(this).prop("checked"));
    });
    //操作按钮事件
    task.table.on("click","button",function(e){
        let data = task.data = task.table.row($(this).parents("tr")).data();
        switch($(this).data("type")){
            case 'run': task.run(data);break;           //运行
            case 'stop': task.stop(data);break;         //停止
            case 'runOnce': task.runOnce(data);break;   //运行一次
            case 'upd': task.upd(data);break;           //修改
            case 'del': task.del(data);break;       //删除
            default: break;
        }
    });
    //顶部按钮事件
    $("#btn button").on("click",function(){
        let data = task.table.rows($("#list input:checked").parents("tr")).data().toArray();
        console.log(data);
        switch($(this).data("type")){
            case 'ins': task.ins({});break;       //新增
            case 'runN': break;       //运行已选
            case 'stopN': break;     //停止已选
            case 'runOnceN': break; //运行一次
            case 'delN': break;       //删除已选
            default:break;
        }
    });
}
//加载表格数据
function loadTask(page){
    page = task.page = $.extend({ curr: 1,limit: 2 },page);
    //请求数据
    sendComm("POST","/api/api_task/selectByPage",{ page:page.curr,size:page.limit },function(result){
        //表格数据重载
        task.table.clear().rows.add(result&&result.data?result.data:[]).draw();
        //重绘分页
        layui.laypage.render({
            elem: 'list_page',
            curr: result.page||page.curr,
            limit: result.size||page.limit,
            count: result.total,
            // limits:[5,10,20,40],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            theme: '#1E9FFF',
            jump:function(p,isFirst){
                !isFirst?loadTask(p):null;
            }
        });
    });
}
//ajax请求
function sendComm(method,url,data,callback){
    var errcb = function(){ layer.msg('数据请求失败。。。',{time: 2000, icon:5}); }
    $.ajax({ type: method, url: url, data: JSON.stringify(data), contentType: "application/json", success: callback,error: errcb });
}
//入口
$(document).ready(function(){
    layui.use(["layer","laypage","laytpl","form"],function(){
        initList();
        //console.log($.url().data.param.query);
        loadTask({ curr:$.url().param("curr"),limit:$.url().param("limit") });
    })
});