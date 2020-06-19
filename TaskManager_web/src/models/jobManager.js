import * as jobManagerService from '../services/jobManager';

export default {
	namespace: 'jobManager',
	state: {
		list: [], total: null, page: null,
	},
	reducers: {
		save(state, { payload: { data: list, total, page } }) {
			return { ...state, list, total, page };
		},
	},
	effects: {
		*fetch({ payload: { page = 1, ...values } }, { call, put }) {
			const { data, total } = yield call(jobManagerService.fetch, { page, values });
			yield put({ type: 'save', payload: { data, total: parseInt(total, 10), page: parseInt(page, 10) } });
		},
		*remove({ payload: { values } }, { call, put, select }) {
			yield call(jobManagerService.remove, where);
			const page = yield select(state => state.jobManager.page);
			yield put({ type: 'fetch', payload: { page } });
		},
		*update({ payload: { values } }, { call, put, select }) {
			yield call(jobManagerService.update, values);
			const page = yield select(state => state.jobManager.page);
			yield put({ type: 'fetch', payload: { page } });
		},
		*insert({ payload: { values } }, { call, put, select }) {
			yield call(jobManagerService.insert, values);
			const page = yield select(state => state.jobManager.page);
			yield put({ type: 'fetch', payload: { page } });
		}
	},
	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname, query }) => {
				if (pathname === '/jobManager') {
					dispatch({ type: 'fetch', payload: query });
				}
			});
		},
	},
};
