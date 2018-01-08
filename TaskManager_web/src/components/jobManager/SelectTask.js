import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal,Form} from 'antd';
import { PAGE_SIZE} from '../../constants';
import { routerRedux } from 'dva/router';

import TaskList from './TaskList'

class SelectTack extends Component{
	constructor(props) {
		super(props);
		this.state = {visible: false};
	}
	showModelHandler = (e) => {	//显示组件
		if (e){e.stopPropagation();}
		this.setState({visible: true});
	};
	hideModelHandler = () => {	//隐藏组件
		this.setState({visible: false});
		this.props.form.resetFields();
	};
	submitSelect=(task)=>{	//提交选择
		const { onOk } = this.props;
		onOk(task);
		this.hideModelHandler();
	}
	render() {
		const { children } = this.props;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {labelCol: { span: 6 },wrapperCol: { span: 14 }};
		//console.log(this.props.parent.props.form.getFieldValue("taskId"));
		this.param={};
		this.param.selected=this.props.parent.props.form.getFieldValue("taskId")
		return (
			<span>
				<span onClick={this.showModelHandler}>{ children }</span>
				<Modal title="选择任务" {...this.state} onOk={this.okHandler} onCancel={this.hideModelHandler} width={1000}>
					<TaskList parent={this}/>
				</Modal>
			</span>
		);
	}
}


export default Form.create()(SelectTack);;
