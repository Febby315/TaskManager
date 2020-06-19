import React from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Icon, Form } from 'antd';
import { PAGE_SIZE } from '../../constants';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;

function Main({ dispatch, list, loading, total, page: current, parent }) {
	function onPageChange(page, pageSize) {
		dispatch({
			type: 'taskManager/fetch',
			payload: { page: page, size: pageSize },
		});
	}
	function selectOk(record) {	//单击任务事件
		parent.submitSelect(record);
	}
	function onRowClick(record, index) {//行单击事件
		//console.log(record,index);
	}
	console.log(parent.param);
	const columns = [
		{ title: '任务ID', dataIndex: 'id', key: 'id' },
		{ title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
		{ title: 'cron', dataIndex: 'cron', key: 'cron' },
		{ title: '状态', key: 'state', render: (text, record) => (record.state == '1' ? '运行中' : '停用') },
		{ title: '备注', dataIndex: 'remark', key: 'remark' },
		{
			title: '选择', key: 'selectId', render: (text, record) => {
				return (<Icon type={record.id === parent.param.selected || null ? "check-circle" : "check-circle-o"} onClick={selectOk.bind(null, record)} style={{ fontSize: 24 }} />);
			}
		}
	];
	const state = {
		pagination: { size: "small", total: total, current: current, onChange: onPageChange },	//分页
		size: 'small',	//大小
		showHeader: true,	//表头
		loading: loading,
		onRowClick: onRowClick
	}

	return (
		<div>
			<Row gutter={30}>
				<Table {...state} columns={columns} dataSource={list} rowKey={record => record.id} />
			</Row>
		</div>
	);
}
//此方法被执行3次
function mapStateToProps(state) {
	const { list, total, page } = state.taskManager;//列表,数量,页码
	return { loading: state.loading.models.enterprises, list, total, page };
}
export default connect(mapStateToProps)(Main);