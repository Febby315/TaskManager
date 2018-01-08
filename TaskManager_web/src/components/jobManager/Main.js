import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col,Button ,Input,Breadcrumb,Select,Form} from 'antd';
const FormItem = Form.Item;
import { PAGE_SIZE } from '../../constants';
import { routerRedux } from 'dva/router';

import Add from './Add';
import Edit from './Edit';
function Main({dispatch,loading,list,total,page,breadCrumb}) {
	function onPageChange(page,pageSize){	//翻页操作
		dispatch({
			type: 'jobManager/fetch',
			payload:{page:page,size:pageSize},
		});
	}
	function insert(values) {	//增加
		dispatch({
			type: 'jobManager/insert',
			payload: {values},
		});
	}
	function update(values) {	//修改
		dispatch({
			type: 'jobManager/update',
			payload:{values},
		});
	}
	function remove(values) {	//删除操作
		var where = {};
		where.id=values.id;
		dispatch({
			type: 'jobManager/remove',
			payload: where
		});
	}
	const columns = [
		{
			title: '作业ID',
			dataIndex: 'id',
			key: 'id',
		},{
			title: '作业名称',
			dataIndex: 'jobName',
			key: 'jobName',
		},{
			title: '任务ID',
			dataIndex: 'taskId',
			key: 'taskId',
		},{
			title: '命令',
			dataIndex: 'command',
			key: 'command',
		},{
			title: '参数',
			dataIndex: 'params',
			key: 'params',
		},{
			title: '备注',
			dataIndex: 'remark',
			key: 'remark',
		},{
			title: '操作',
			key: 'operation',
			render:(text,record)=>{
				return (
					<span>
						<Edit record={record} onOk={update}>
							<Button>修改</Button>
						</Edit>|
						<Popconfirm title='确定删除这个任务吗' placement='left' onConfirm={remove.bind(null,record)}>
							<Button>删除</Button>
						</Popconfirm>
					</span>
				)
			}
		}
	];
	return (
		<div>
			<Row>
				<Col span={24}>
					<div style={{padding:'8px',backgroundColor:'#f7f7f7'}}>{breadCrumb}</div>
				</Col>
			</Row>
			<Row style={{marginTop:"10px"}}>
				<Col span={24}>
					<Add onOk={insert}>
						<Button type="primary" size="large" >新增</Button>
					</Add>
				</Col>
			</Row>
			<Row style={{marginTop:"10px",textAglin:"center"}}>
				<Col span={24}>
					<Table /*表格*/
						columns={columns}
						dataSource={list}
						loading={loading}
						bordered
						rowKey={record => record.id}
						pagination={false}
					/>
					<Pagination /*分页*/
						className="ant-table-pagination"
						total={total}
						current={page}
						defaultPageSize={PAGE_SIZE}
						onChange={onPageChange}
						size="small"
					/>
				</Col>
			</Row>
		</div>
	);
}
function mapStateToProps(state) {
	const {list,total,page}=state.jobManager;
	return {loading:state.loading.models.enterprises,list,total,page};
}
export default connect(mapStateToProps)(Main);
