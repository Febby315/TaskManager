import React from 'react';
import { connect } from 'dva';
import Layout from '../components/layout/Layout';
import Main from '../components/taskManager/Main';

function Enterprises() {
  const breadCrumb = "任务管理";
  return (
    <Layout  location={location} menu={"sub1"} submenu={"sub1_1"}>
      <Main breadCrumb = {breadCrumb} />
    </Layout>
  );
}
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Enterprises);
