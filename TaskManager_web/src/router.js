import React from 'react';
import {Router,Route} from 'dva/router';

import IndexPage from "./routes/IndexPage.js";
import TaskManager  from "./routes/TaskManager.js";
import JobManager  from "./routes/JobManager.js";

function RouterConfig({history}) {
	return (
	<Router history={history}>
		<Route path="/" component={IndexPage}/>
		<Route path="/taskManager" component={TaskManager}/>
		<Route path="/jobManager" component={JobManager}/>
	</Router>
	);
}

export default RouterConfig;
