import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';

// 1.创建app
const app = dva();
// 2.添加插件
app.use(createLoading());
// 3.注册模块
app.model(require("./models/taskManager"));
app.model(require("./models/jobManager"));
// 4.配置路由组件
app.router(require('./router'));
// 5.启动app
app.start('#root');