import request from '../utils/request';

export function fetch({ page, values }) {  //查询
	return request(`/api_task/selectByPage`, {
		type: 'POST',
		data: { page: page, ...values },
	});
}

export function insert(values) {  //增加
	return request(`/api_task/insert`, {
		type: 'POST',
		data: values,
	});
}

export function update(values) {  //修改
	return request(`/api_task/update`, {
		type: 'POST',
		data: values
	});
}

export function remove(where) { //删除
	return request(`/api_task/delete`, {
		type: 'POST',
		data: where
	});
}
export function run(where) {  //运行
	return request(`/api_task/run`, {
		type: 'POST',
		data: where
	});
}
export function runOne(where) {  //运行
	return request(`/api_task/runOne`, {
		type: 'POST',
		data: where
	});
}
export function stop(where) { //停止
	return request(`/api_task/stop`, {
		type: 'POST',
		data: where
	});
}

