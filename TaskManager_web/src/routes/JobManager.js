import React from 'react';
import { connect } from 'dva';
import Layout from '../components/layout/Layout';
import Main from '../components/jobManager/Main';

function Enterprises() {
  const breadCrumb = "作业管理";
  return (
    <Layout location={location} menu={"sub1"} submenu={"sub1_2"}>
      <Main breadCrumb = {breadCrumb} />
    </Layout>
  );
}
function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Enterprises);