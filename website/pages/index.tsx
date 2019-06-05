import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import { getJSON } from '../helper';

import magnifier from '../assets/images/magnifier.png';
import '../assets/style/index.less';

interface ItemType {
  imgSrc: string;
  link: string;
  url: string;
  chart_name: string | number;
  chart_author: string | number;
  chart_time: string | number;
}

interface PageState {
  charts: any[];
}

interface PageProps {
  charts: any[];
}

class IndexPage extends React.Component<PageProps, PageState> {
  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      charts: [],
    };
  }

  componentDidMount() {
    getJSON('./static/json/config.json', (data: any) => {
      if (data) {
        this.setState({
          charts: data,
        });
      }
    });
  }

  /**
   * 获取示例列表
   * @returns {*}
   */
  getArtList() {
    const { charts } = this.state;
    return charts.map((item: ItemType, index: number) => (
      <li className="chart" key={index}>
        <div className="chart_wrap">
          <span
            className="chart_bg"
            style={{
              backgroundImage: `url('${item.imgSrc}')`,
            }}
          >
            <div className="chart_hover animation clearfix">
              <div
                className="chart_magnifier_left"
                onClick={event => this.handleClick(event, 'origin', item)}
              >
                <div>
                  <img src={magnifier} alt="logo" />
                </div>
                <div>基本示例</div>
              </div>
              <Link to={item.link}>
                <div className="chart_magnifier_right">
                  <div>
                    <img src={magnifier} alt="logo" />
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
    ));
  }

  handleClick = (event: any, type: string, item: ItemType) => {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (type === 'origin') {
      window.open(item.url);
    }
  };

  /**
   * render
   * @returns {*}
   */
  render() {
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
    );
  }
}

export default IndexPage;
