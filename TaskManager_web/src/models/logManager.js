import * as logManagerService from '../services/logManager';

export default {
	namespace: 'logManager',
	state: {
		list: [],
		total: null,
		page: null,
	},
	reducers: {
		save(state, { payload: { data: list, total, page } }) {
			return { ...state, list, total, page };
		},
	},
	effects: {
		*select({ payload: { page = 1, ...values } }, { call, put }) {
			const { data, total } = yield call(logManagerService.fetch, { page, values });
			yield put({ type: 'save', payload: { data, total: parseInt(total, 10), page: parseInt(page, 10) } });
		},
		*remove({ payload: where }, { call, put, select }) {
			yield call(logManagerService.remove, where);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'select', payload: { page } });
		},
		*update({ payload: { values } }, { call, put, select }) {
			yield call(logManagerService.update, values);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'select', payload: { page } });
		},
		*insert({ payload: { values } }, { call, put, select }) {
			yield call(logManagerService.insert, values);
			const page = yield select(state => state.taskManager.page);
			yield put({ type: 'select', payload: { page } });
		}
	},
	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathname === '/jobManager') {
					dispatch({ type: 'select', payload: query });
				}
			});
		},
	},
};
