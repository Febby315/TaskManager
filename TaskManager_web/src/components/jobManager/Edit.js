import React, { Component } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import SelectTask from './SelectTask';

const FormItem = Form.Item;
class Edit extends Component {
	constructor(props) {
		super(props);
		this.state = { visible: false, messages: "", value: 1, a: false };
	}
	showModelHandler = (e) => {
		if (e) e.stopPropagation();
		this.setState({
			visible: true,
		});
	}
	hideModelHandler = () => {
		this.setState({
			visible: false,
		});
		this.props.form.resetFields();
	}
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
	selectOk = (task) => {
		this.props.form.setFieldsValue({ taskId: task.id });
	}
	render() {
		const { children } = this.props;
		const { record } = this.props;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
		return (
			<span>
				<span onClick={this.showModelHandler}>{children}</span>
				<Modal title="编辑作业" visible={this.state.visible} onOk={this.okHandler} onCancel={this.hideModelHandler}>
					<Form horizontal onSubmit={this.okHandler} >
						<FormItem {...formItemLayout} label="作业ID">
							{
								getFieldDecorator('id', {
									initialValue: record.id
								})(<Input placeholder="作业ID" disabled />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="作业名称">
							{
								getFieldDecorator('jobName', {
									initialValue: record.jobName,
									rules: [{ required: true, message: '请输入作业名称' }]
								})(<Input placeholder="请输入作业名称" />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="任务ID">
							<Input.Group compact>
								{
									getFieldDecorator('taskId', {
										initialValue: record.taskId
									})(<Input style={{ width: '75%' }} placeholder="请选择任务" />)
								}
								<SelectTask style={{ width: '25%' }} onOk={this.selectOk} parent={this}>
									<Button>请选择</Button>
								</SelectTask>
							</Input.Group>
						</FormItem>

						<FormItem {...formItemLayout} label="执行命令">
							{
								getFieldDecorator('command', {
									initialValue: record.command,
									rules: [{ required: true, message: '请输入需要执行的指令' }]
								})(<Input placeholder="请输入执行命令" />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="params">
							{
								getFieldDecorator('params', {
									initialValue: record.params
								})(<Input placeholder="请输入执行命令" />)
							}
						</FormItem>
						<FormItem {...formItemLayout} label="备注" >
							{
								getFieldDecorator('remark', {
									initialValue: record.remark,
								})(<Input type="textarea" rows={4} placeholder="在此添加额外说明，如线下收费金额等等。" />)
							}
						</FormItem>
					</Form>
				</Modal>
			</span>
		);
	}
}
export default Form.create()(Edit);
