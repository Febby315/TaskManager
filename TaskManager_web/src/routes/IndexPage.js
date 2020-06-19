import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import Layout from '../components/layout/Layout';
import { APP_NAME } from '../constants';

function IndexPage({ location }) {
	return (
		<Layout location={location}>
			<div className={styles.normal}>
				<h1 className={styles.title}>Yay! Welcome to {APP_NAME}!</h1>
				<div className={styles.welcome} />
				<ul className={styles.list}>
					<li>To get started, edit <code>src/index.js</code> and save to reload.</li>
					<li><a href="/">Getting Started</a></li>
				</ul>
			</div>
		</Layout>
	);
}
IndexPage.propTypes = {};

export default connect()(IndexPage);
