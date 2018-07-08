import React, { Component } from 'react';
import { HashRouter, Link } from 'react-router-dom';
import './App.css';
import { MainRouter } from "./router/router";
import { Icon, Layout, Menu } from 'antd';
// const {shell} = require('electron');

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

  handleConnectClick=()=>{
    // shell.openExternal('https://redream.com');
  }

  render () {
    const {selectedKeys}=this.state
    return (
      <HashRouter>
        <Layout style={{minHeight: '100vh'}}>
          <Sider
            collapsible
            width={140}
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
              <MainRouter></MainRouter>
            </Content>
            <Footer style={{textAlign: 'center',color:'#999'}}>
              Ticktack ©2018 Designed by
              <a href="mailto:623702617@qq.com" title={'蒋忠良'} style={{color:'#999'}}> JiangZhongLiang</a> &
              <a href="mailto:so@redream.cn" title={'彭朝阳'} style={{color:'#999'}}> PengChaoYang</a>
            </Footer>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
}

export default App;
