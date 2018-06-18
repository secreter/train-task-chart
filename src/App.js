import React, { Component } from 'react';
import { HashRouter, Link } from 'react-router-dom';
import './App.css';
import { MainRouter } from "./router/router";
import { Icon, Layout, Menu } from 'antd';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class App extends Component {
  state = {
    collapsed: false,
    selectedKeys:['add']
  };
  onCollapse = (collapsed) => {
    this.setState({collapsed});
  }
  handleMenuClick=({ item, key, keyPath })=>{
    let hash=window.location.hash
    if(hash.includes(key)){
      this.setState({
        selectedKeys:[key]
      })
    }
  }

  render () {
    const {selectedKeys}=this.state
    return (
      <HashRouter>
        <Layout style={{minHeight: '100vh'}}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" selectedKeys={selectedKeys} mode="inline" onClick={this.handleMenuClick}>
              <Menu.Item key="add">
                <Link to={'/add'}>
                  <Icon type="form" />
                  <span>新建图表</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="list">
                <Link to={'/list'}>
                  <Icon type="profile" />
                  <span>所有图表</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            {/*{/*</Header>*/}
            <Content style={{margin: '16px 16px'}}>
              {/*<Breadcrumb style={{ margin: '16px 0' }}>*/}
              {/*<Breadcrumb.Item>User</Breadcrumb.Item>*/}
              {/*<Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
              {/*</Breadcrumb>*/}
              <MainRouter></MainRouter>
            </Content>
            <Footer style={{textAlign: 'center'}}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
}

export default App;
