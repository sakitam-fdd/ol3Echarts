import React, { Component } from 'react'; // eslint-disable-line
import { Link } from 'react-router-dom'; // eslint-disable-line
import Header from './Header'; // eslint-disable-line
import { getJSON } from '../helper';
import magnifier from '../assets/images/magnifier.png';
import '../assets/style/index.scss';

class Index extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      charts: []
    }
  }

  componentDidMount () {
    getJSON('./static/json/config.json', data => {
      if (data) {
        this.setState({
          charts: data
        })
      }
    })
  }

  handleClick = (event, type, item) => {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
    if (type === 'origin') {
      window.open(item.url)
    } else {
    }
  };

  /**
   * 获取示例列表
   * @returns {*}
   */
  getArtList () {
    const { charts } = this.state;
    return charts.map((item, index) => {
      return (
        <li className="chart" key={index}>
          <div className="chart_wrap">
            <span
              className="chart_bg"
              style={{
                backgroundImage: `url('${item.imgSrc}')`
              }}>
              <div className="chart_hover animation clearfix">
                <div className="chart_magnifier_left" onClick={event => this.handleClick(event, 'origin', item)}>
                  <div>
                    <img src={magnifier} />
                  </div>
                  <div>基本示例</div>
                </div>
                <Link to={item.link}>
                  <div className="chart_magnifier_right">
                    <div>
                      <img src={magnifier} />
                    </div>
                    <div>React示例</div>
                  </div>
                </Link>
              </div>
            </span>
            <div className="chart_info">
              <div className="chart_name">{item.chart_name}</div>
              <div className="chart_detail clearfix">
                <div className="chart_author pull-left">
                  <span className="chart_icon chart_author_icon" />
                  <span className="chart_icontxt">{item.chart_author}</span>
                </div>
                <div className="chart_time pull-right">
                  <span className="chart_icon chart_time_icon" />
                  <span className="chart_icontxt">{item.chart_time}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      )
    })
  }

  /**
   * render
   * @returns {*}
   */
  render () {
    return (
      <div>
        <Header />
        <div className="main">
          <div className="charts-list">
            <ul id="charts-list-ul" className="charts-list-ul clearfix">
              {this.getArtList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Index;
