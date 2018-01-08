import React, { Component } from 'react';
import { Modal, Form, Input,message,Button,Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Edit extends Component {
	constructor(props) {
		super(props);
		this.state = {visible: false,messages:"",value:1,a:false};
	}
	showModelHandler = (e) => {
		if (e) e.stopPropagation();
		this.setState({
			visible: true,
		});
	};
	hideModelHandler = () => {
		this.setState({
			visible: false,
		});
		this.props.form.resetFields();
	};
	okHandler = () => {
		const { onOk } = this.props;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				onOk(values);
				this.hideModelHandler();
			}
		});
		this.props.form.resetFields();
	}
	render() {
		const { children } = this.props;
		const { getFieldDecorator } = this.props.form;
		const record= this.props.record || {};
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};
		return (
			<span>
				<span onClick={this.showModelHandler}>
					{ children }
				</span>
				<Modal title="编辑任务" visible={this.state.visible} onOk={this.okHandler} onCancel={this.hideModelHandler}>
					<Form horizontal onSubmit={this.okHandler} >
						<FormItem {...formItemLayout} label="任务ID">
							{
								getFieldDecorator('id', {
									initialValue:record.id
								})(<Input placeholder="企业名称" disabled/>)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="任务名称">
							{
								getFieldDecorator('taskName',{
									initialValue:record.taskName,
									rules: [{required: true, message: '请输入任务名称'}]
								})(<Input placeholder="请输入任务名称"/>)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="cron">
							{
								getFieldDecorator('cron',{
									initialValue:record.cron,
									rules: [{required: true, message: '请输入Cron表达式'}]
								})(<Input placeholder="请输入Cron表达式"/>)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="备注" >
							{
								getFieldDecorator('remark'	, {
									initialValue: record.remark,
								})(<Input type="textarea" rows={4} placeholder="在此添加额外说明，如线下收费金额等等。"/>)
							}
						</FormItem>
					</Form>
				</Modal>
			</span>
		);
	}
}

export default Form.create()(Edit);
