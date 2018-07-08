/**
 * Created by So on 2018/6/8.
 */
const { app, BrowserWindow } = require('electron');

// 浏览器引用
let win;

// 创建浏览器窗口函数
let createWindow = () => {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 920,
    minWidth: 920,
    height: 600,
    minHeight: 600,
    icon:'./build/favicon.ico'
  });

  // 加载应用中的index.html文件
  win.loadFile('./build/index.html/');
  // 加载应用的 index.html
  // win.loadURL('file://' + __dirname + '/build/index.html');
  // 打开开发者工具
  // win.webContents.openDevTools()
  // 当win被关闭时，除掉win的引用
  win.on('closed', () => {
    win = null;
  });

  //设置菜单
  win.setMenu(null)
  win.setTitle('Ticktack')
};

// 当app准备就绪时候开启窗口
app.on('ready', createWindow);

// 当全部窗口都被关闭之后推出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在macos上，单击dock图标并且没有其他窗口打开的时候，重新创建一个窗口
app.on('activate', () => {
  if (win == null) {
    createWindow();
  }
});