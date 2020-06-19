import React from 'react';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Row, Col, Button, Input, Breadcrumb, Select, Form, message } from 'antd';
import { PAGE_SIZE } from '../../constants';
import { routerRedux } from 'dva/router';

import Add from './Add';
import Edit from './Edit';

function Main({ dispatch, list, loading, total, page, breadCrumb }) {
	//翻页事件处理函数
	function onPageChange(page, pageSize) {
		dispatch({
			type: 'taskManager/fetch',
			payload: { page: page, size: pageSize },
		});
	}
	function insert(values) {	//增加
		dispatch({
			type: 'taskManager/insert',
			payload: { values },
		});
	}
	function update(values) {	//修改
		dispatch({
			type: 'taskManager/update',
			payload: { values },
		});
	}
	function run(values) {	//运行
		var where = { id: values.id };
		dispatch({
			type: 'taskManager/run',
			payload: where
		});
	}
	function runOne(values) {	//运行一次
		var where = { id: values.id };
		dispatch({
			type: 'taskManager/runOne',
			payload: where
		});
		message.success('单次执行' + values.taskName + '命令已发送');
	}
	function stop(values) {	//停止
		var where = { id: values.id };
		dispatch({
			type: 'taskManager/stop',
			payload: where
		});
	}
	function changeStatu(values) {	//修改状态
		var id = values.id;
		values.state = Math.abs(parseInt(values.state, 10) - 1);
		values.state ? run(values) : stop(values);
	}
	function remove(values) {	//删除操作
		var where = {};
		where.id = values.id;
		dispatch({
			type: 'taskManager/remove',
			payload: where
		});
	}

	const columns = [
		{
			title: '任务ID',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '任务名称',
			dataIndex: 'taskName',
			key: 'taskName',
		}, {
			title: 'cron',
			dataIndex: 'cron',
			key: 'cron',
		}, {
			title: '状态',
			key: 'state',
			render: (text, record) => (record.state == '1' ? '运行中' : '停用'),
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark',
		}, {
			title: '操作',
			key: 'operation',
			render: (text, record) => {
				return (
					<span>
						{/*<Button>预览</Button>|*/}
						<Popconfirm title={record.state == '1' ? '确定停止这个任务吗？' : '确定运行这个任务吗？'} onConfirm={changeStatu.bind(null, record)}>
							<Button>{record.state == '1' ? '停止' : '运行'}</Button>|
						</Popconfirm>
						<Edit record={record} onOk={update}>
							<Button>修改</Button>
						</Edit>|
						<Popconfirm title='确定删除这个任务吗' placement='left' onConfirm={remove.bind(null, record)}>
							<Button>删除</Button>
						</Popconfirm>|
						<Popconfirm title='确定删除这个任务吗' placement='left' onConfirm={runOne.bind(null, record)}>
							<Button>runOne</Button>
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
					<div style={{ padding: '8px', backgroundColor: '#f7f7f7' }}>{breadCrumb}</div>
				</Col>
			</Row>
			<Row gutter={30} style={{ marginTop: "10px" }}>
				<Col span={24}>
					<Add onOk={insert}>
						<Button type="primary" size="large" >新增</Button>
					</Add>
				</Col>
			</Row>
			<Row gutter={30} style={{ marginTop: "10px" }}>
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
//此方法被执行3次
function mapStateToProps(state) {
	const { list, total, page } = state.taskManager;
	return { loading: state.loading.models.enterprises, list, total, page };
}

export default connect(mapStateToProps)(Main);
