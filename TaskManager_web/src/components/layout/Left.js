import React from 'react';
import {Menu, Breadcrumb, Icon, message} from 'antd';
const SubMenu = Menu.SubMenu;
import {Link} from 'react-router'
import logo from '../../../public/images/logoHome.png'
import styles from './stylesheets/Left.css';

function Left({children,location,menu,submenu}) {
	//console.log(menu+">"+submenu);	//面包屑
	let menuJson = [
		{
			"key":"sub1","name":"任务管理","icon":"home",
			"children": [
				{"key":"sub1_1","name":"任务管理",icon:"calendar" ,"value":"/taskManager"},
				{"key":"sub1_2","name":"作业管理",icon:"book","value":"/jobManager"},
				{"key":"sub1_3","name":"日志管理",icon:"solution","value":"/logManager"}
			]
		},
		{
			"key":"sub2","name":"关于项目","icon":"setting",
			"children":[]
		}
	];
	return (<aside className={styles.sider_a}>
		<div className="ant-layout-logo" ><img src={logo}/></div>
		<div style={{padding:"0px"}}>
			<Menu defaultOpenKeys={["sub1","sub2"]} defaultSelectedKeys={[submenu]} mode="inline" theme="dark" >
				{menuJson.map(function(item){
					return <SubMenu key={item.key} title={<span><Icon type={item.icon}/>{item.name}</span>}>
						{item.children.map(function(subMenus){
							return <Menu.Item key={subMenus.key}>
								<Link to={subMenus.value}><Icon type={subMenus.icon}/>{subMenus.name}</Link>
							</Menu.Item>
						})}
					</SubMenu>
				})}
			</Menu>
		</div>
	</aside>)
}
export default Left;
