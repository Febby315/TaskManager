import request from '../utils/request';

export function fetch({ page, values }) {  //查询
	return request(`/api_job/selectByPage`, {
		type: 'POST',
		data: { page: page, ...values },
	});
}

export function insert(values) {  //增加
	return request(`/api_job/insert`, {
		type: 'POST',
		data: values,
	});
}

export function update(values) {  //修改
	return request(`/api_job/update`, {
		type: 'POST',
		data: values
	});
}

export function remove(values) { //删除
	return request(`/api_job/delete`, {
		type: 'POST',
		data: values
	});
}

export function search(values) {  //搜索
	return request(`/api_job/*`, {
		type: 'POST',
		data: values,
	});
}


