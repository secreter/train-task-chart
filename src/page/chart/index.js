import React from 'react';
import G2 from '@antv/g2';
import './index.less'
import { Breadcrumb, Button, Col, Row,Icon } from 'antd';
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage('db')
const db = low(adapter)
const ButtonGroup = Button.Group;

class Chart extends React.Component {
  constructor (props) {
    super(props);
    let {data, title, id, isNew} = Chart.init(props)
    this.state = {
      data,
      title,
      id,              //edit or new
      match: props.match
    }
    this.chart = null
  }

  componentDidMount () {
    this.draw()
  }

  static init = (props) => {
    let {id} = props.match.params
    let data = [], title = '', isNew = true
    db.read()
    let table = db.get('tables')
      .find({id})
      .value()
    data = table.data
    title = table.title
    isNew = false
    return {data, title, id, isNew}
  }

  draw = () => {
    const {data} = Chart.init(this.props)
    // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
    let values = ['非重组', '重组'];
    data.forEach(function (obj) {
      obj.range = [obj.startTime.replace(/\//g, '-'), obj.endTime.replace(/\//g, '-')];
      obj.status = values[obj.isDouble === '是' ? 1 : 0];
    });
    console.log(data)
    // Step 1: 创建 Chart 对象
    this.chart = new G2.Chart({
      container: 'canvas',
      // forceFit: true,
      width: window.innerWidth - 200,
      padding: [80, 80, 80, 100],
      background: {
        fill: '#fff'
      },
      plotBackground: {
        stroke: '#000', // 图表边框颜色
      }
    });
    //设置图例
    // this.chart.legend({
    //   position: 'bottom', // 设置图例的显示位置
    //   itemGap: 20 // 图例项之间的间距
    // });
    // this.chart.axis('xField', {
    //   tickLine: {
    //     lineWidth: 2,
    //     length: 10,
    //     stroke: 'red'
    //   }
    // });
    // Step 2: 载入数据源
    this.chart.source(data, {
      range: {
        nice: true,
        type: 'time',
        mask: 'HH:mm:ss',
        // min:'00:00',
        tickInterval: 1000 * 3600          //m秒
        // tickCount:20
      }
    });
    // this.chart.scale('range', {
    //   tickInterval: 20000
    // });
    this.chart.coord().transpose().scale(1, -1);
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    this.chart.interval()
      .position('trackId*range')
      .label('description', {
        offset: -10,
        textStyle: {
          textAlign: 'end', // 文本对齐方向，可取值为： start middle end
          fill: '#404040', // 文本的颜色
          fontSize: '12', // 文本大小
          fontWeight: 'bold', // 文本粗细
          rotate: 0,
          textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
        },
      })               //文本映射到图像上
      // .style('trackId',{
      //   stroke: '#000',
      //   lineWidth: 1
      // })
      .color('status', ['#2FC25B', '#F04864'])
    // Step 4: 渲染图表
    this.chart.render();
  }

  handleDownloadClick=()=> {
    this.chart.downloadImage();
  }

  handleBack = () => {
    window.history.back()
  }

  render () {
    const {title} = this.state
    return (
      <div>
        <Row className={'header'}>
          <Col span={4}>
            <Breadcrumb style={{margin: '0px 0'}}>
              <Breadcrumb.Item onClick={this.handleBack}><a href="javascript:;">{'<< 返回'}</a></Breadcrumb.Item>
              <Breadcrumb.Item>{title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col span={20} className={'download'}>
            <Button onClick={this.handleDownloadClick}  href="javascript:;"><Icon type="cloud-download" />保存图片</Button>
          </Col>
        </Row>
        <div id={'canvas'}>

        </div>
      </div>
    )
  }
}

export default Chart