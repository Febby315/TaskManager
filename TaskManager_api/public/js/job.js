var v_job=new Vue({
    el:"#body",
    data:{
        checkedAll:false,
        total:10, page:1, pageSize:5,
        addView:false, editView:false,
        form:{},
        list:[],
        taskList:[]
    },
    mounted:function(){
        this.$nextTick(function(){
            this.loadList();
        });
    },
    methods:{
        //新增
        insert:function(){
            _this=this;
            axios.post("/api/api_job/insert",_this.form).then(function(res){
                console.log(res.data);
                res && res.data && res.data.result && res.data.result.n==res.data.result.ok ? _this.$Message.success("数据新增成功") : _this.$Message.error("数据新增失败");
                _this.loadList();
            }).catch(function (err) {
                _this.$Message.error(err.message);
            });
        },
        //删除
        delete:function(item){
            _this=this;
            axios.post("/api/api_job/delete",{ id:item.id }).then(function(res){
                res && res.data && res.data.n==res.data.ok ? _this.$Message.success("记录删除成功") : _this.$Message.error("记录删除失败");
            }).catch(function (err) {
                _this.$Message.error(err.message);
            });
        },
        //更新
        update:function(){
            console.log(_this.form)
            _this=this;
            axios.post("/api/api_job/update",_this.form).then(function(res){
                res && res.data && res.data.n==res.data.ok ? _this.$Message.success("记录更新成功") : _this.$Message.error("记录更新失败");
                _this.loadList();
            }).catch(function (err) {
                _this.$Message.error(err.message);
            });
        },
        //加载数据
        loadList:function(){
            _this = this;
            _this.checkedAll = false;
            axios.post("/api/api_job/selectByPage",{ page:_this.page, pageSize:_this.pageSize }).then(function(res){
                _this.list = res.data.data;
                _this.total = res.data.total;
            }).catch(function (err) {
                _this.$Message.error(err.message);
            });
        },
        //增加
        add:function(){
            _this = this;
            _this.form = {};
            axios.post("/api/api_task/select",{}).then(function(res){
                _this.taskList = res.data.data;
                _this.addView = !_this.addView;
            }).catch(function (err) {
                _this.$Message.error(err.message);
            });
        },
        //移除
        remove:function(item){
            _this = this;
            _this.list.indexOf(item)>=0 ? _this.delete(item) : _this.list.forEach(function(item,i){
                item.checked ? _this.delete(item) : null;
            });
            _this.loadList();
        },
        //修改
        modify:function(item){
            _this = this;
            _this.form = JSON.parse(JSON.stringify(item));
            axios.post("/api/api_task/select",{}).then(function(res){
                _this.taskList = res.data.data;
                _this.editView = !_this.editView;
            }).catch(function (err) {
                _this.$Message.error(err.message);
            });
        },
        //分页改变
        pageChange:function(page){
            this.page = page;
            this.loadList();
        },
        //分页大小改变
        pageSizeChange:function(size){
            this.pageSize = size;
            this.loadList();
        },
        //选择
        onCheck:function(curr){
            _this = this;
            _this.checkedAll = true;
            _this.list.forEach(function(item,i){
                _this.$set(item,"checked",_this.list.indexOf(curr)==i ? !item.checked : !!item.checked);
                _this.checkedAll = _this.checkedAll&&item.checked;
            });
        },
        //全选
        checkAll:function(){
            _this = this;
            _this.checkedAll = !_this.checkedAll
            _this.list.forEach(function(item,i){
                _this.$set(item,"checked",_this.checkedAll);
            });
        }
    }
});