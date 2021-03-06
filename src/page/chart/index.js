import React from 'react';
import G2 from '@antv/g2';
import low from 'lowdb'
import moment from 'moment'
import { Breadcrumb, Button, Col, Row,Icon } from 'antd';
import {TASK,TRACK} from '../../config';
import LocalStorage from 'lowdb/adapters/LocalStorage'

import './index.less'

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
      match: props.match,
      width:window.innerWidth - 200,
    }
    this.chart = null
    this.origin={}    //当前鼠标下的色块数据
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions);
    this.draw()
  }
  updateDimensions=()=>{
    this.setState({
      width:window.innerWidth - 200
    })
  }

  componentDidUpdate () {
    // this.chart.destroy()
    // this.draw()
    this.chart.changeWidth(this.state.width)
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
    let {data} = Chart.init(this.props)
    console.log(data)

    let min,max,tmp,trackIdSet=new Set()
    // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
    data.forEach(function (obj) {
      if(!min){
        min=moment(obj.startTime).valueOf()
      }else{
        tmp=moment(obj.startTime).valueOf()
        min=min<tmp?min:tmp
      }
      if(!max){
        max=moment(obj.startTime).valueOf()
      }else{
        tmp=moment(obj.startTime).valueOf()
        max=max>tmp?max:tmp
      }
      trackIdSet.add(obj.trackId)
      obj.group='all'         //全部一个组，为了减小间距
      obj.range = [obj.startTime.replace(/\//g, '-'), obj.endTime.replace(/\//g, '-')];
    });
    min=moment(min).format('YYYY-MM-DD 18:00:00')
    max=moment(max+24*60*60*1000).format('YYYY-MM-DD 18:00:00')

    let placeholders=TRACK.map(trackId=>{
      return {
        description:'',
        endTime:min,
        group:"all",
        key:'',
        range: [min, min],
        startTim:min,
        task:"",
        trackId,
        trainId:"",
      }
    })
    data=placeholders.concat(data)
    console.log(data)
    // let num=trackIdSet.size<3?3:trackIdSet.size
    let num=TRACK.length
    // Step 1: 创建 Chart 对象
    G2.Global.widthRatio.column=4/5    //调节柱状图宽度和间距
    this.chart = new G2.Chart({
      container: 'canvas',
      // forceFit: true,
      width: this.state.width,
      height:45*num+100,
      // padding: [80, 80, 80, 100],
      padding: [40, 80, 80, 80],
      background: {
        fill: '#fff'
      },
      // plotBackground: {
      //   stroke: '#000', // 图表边框颜色
      // }
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
        // mask: 'HH:mm:ss',
        mask: 'HH:mm',
        min,
        max,
        tickInterval: 1000 * 3600          //m秒
        // tickCount:20
      }
    });
    //自定义模板，自定义tooltip展示
    this.chart.tooltip({
      triggerOn:'none',              // 不触发 tooltip，用户通过 chart.showTooltip() 和 chart.hideTooltip() 来控制 tooltip 的显示和隐藏。
      shared:false,
      itemTpl: `<li>
                    <div>车组号：{trainId}</div>
                    <div>时间：{startTime} - {endTime}</div>
                    <div>备注：{description}</div>
                </li>`
    });
    this.chart.coord().transpose().scale(1, -1);
    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    this.chart.interval()
      .position('trackId*range')
      .label('trainId', {
        offset: -10,
        textStyle: {
          textAlign: 'end',      // 文本对齐方向，可取值为： start middle end
          fill: '#404040',       // 文本的颜色
          fontSize: '12',        // 文本大小
          fontWeight: 'bold',    // 文本粗细
          rotate: 0,
          textBaseline: 'middle' // 文本基准线，可取 top middle bottom，默认为middle
        },
      })                          //文本映射到图像上
      .tooltip('startTime*endTime',(a, b) => {                      //自定义tooltip
        // 返回的参数名对应 itemTpl 中的变量名
        return this.origin
      })
      // .adjust([{
      //   type: 'dodge',
      //   marginRatio: 0.01, // 数值范围为 0 至 1，用于调整分组中各个柱子的间距
      //   dodgeBy: 'group'
      // }])
      // .style('trackId',{
      //   stroke: '#000',
      //   lineWidth: 1
      // })
      .color('task', ['#2FC25B', '#85a5ff','#F04864','#b37feb','#1890ff','#73D13D','#fff566','#873800','#722ed1','#262626'])
    //自定义tooltip,动态改变
    this.chart.on('interval:mouseenter', (ev)=> {
      this.origin=ev.data._origin
      this.chart.showTooltip(ev)
    });
    this.chart.on('interval:mouseleave', (ev)=> {
      // this.origin={
      //   startTime:''
      // }
      this.chart.hideTooltip(ev)
    });
    let oldEv={x:0}
    this.chart.on('interval:mousemove', (ev)=> {
      if(Math.abs(ev.x-oldEv.x)>2 ){
        oldEv=ev
        this.chart.showTooltip(ev)
      }
    });
    // Step 4: 渲染图表
    this.chart.render();
  }

  handleDownloadClick=()=> {
    this.chart.downloadImage();
  }

  handleBack = () => {
    const {history,match}=this.props
    const {replace,location,go}=history
    if(location.search==='?add'){
      //来自新建
      replace('/add/'+match.params.id)
    }else{
      replace('/list')
    }
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