import * as taskManagerService from '../services/taskManager';

export default {
	namespace:'taskManager',
	state:{
		list: [],
		total: null,
		page: null,
	},
	reducers:{
		save(state,{payload:{data:list,total,page}}) {
			return {...state,list,total,page};
		},
	},
	effects:{
		*fetch({payload:{page=1,...values}},{call,put}) {
			const {data,total} = yield call(taskManagerService.fetch,{page,values});
			yield put({type: 'save',payload: {data,total:parseInt(total,10),page:parseInt(page,10)}});
		},
		*remove({ payload:where}, { call, put, select }) {
			yield call(taskManagerService.remove,where);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'fetch', payload: {page}});
		},
		*update({ payload: {values} }, { call, put, select }) {
			yield call(taskManagerService.update,values);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'fetch', payload: {page}});
		},
		*insert({ payload:{values}}, { call, put, select }) {
			yield call(taskManagerService.insert,values);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'fetch', payload: {page}});
		},
		*run({payload:where},{ call, put, select}) {
			yield call(taskManagerService.run,where);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'fetch', payload: {page}});
		},
		*runOne({payload:where},{ call, put, select}) {
			yield call(taskManagerService.runOne,where);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'fetch', payload: {page}});
		},
		*stop({ payload:where},{ call, put, select }) {
			yield call(taskManagerService.stop,where);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'fetch', payload: {page}});
		}
	},
	subscriptions:{
		setup({ dispatch, history }) {
			return history.listen(({pathname,query}) => {
				if(pathname === '/taskManager') {
					dispatch({type:'fetch',payload:query});
				}
			});
		},
	},
};
