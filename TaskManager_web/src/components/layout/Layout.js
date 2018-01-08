import React from 'react';
import {Row, Col} from 'antd';
import styles from './stylesheets/Layout.css';

import Left from './Left';

function Layout({children, location, menu, submenu}) {
	return (
		<div>
			<Row>
				<Col span={4}>
					<Left menu={menu} submenu={submenu}/>
				</Col>
				<Col span={20} style={{backgroundColor: "#fff",height: "100vh"}}>
					<div className={styles.main_container}>
						{children}
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default Layout;
