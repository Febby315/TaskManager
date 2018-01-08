import request from '../utils/request';

export function select({page,values}) {  //查询
  return request(`/api_taskLog/selectByPage`,{
    type: 'POST',
    data: {page:page,...values},
  });
 }

export function insert(values) {  //增加
  return request(`/api_taskLog/insert`, {
    type: 'POST',
    data: values,
  });
}

export function update(values) {  //修改
  return request(`/api_taskLog/update`, {
    type: 'POST',
    data: values
  });
}

export function remove(where) { //删除
  return request(`/api_taskLog/delete`,{
    type:'POST',
    data:where
  });
}

export function search(values) {
  return request(`/api_taskLog/search`, {
    type: 'POST',
    data: values,
  });
}