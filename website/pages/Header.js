import React, { Component } from 'react'; // eslint-disable-line
import logo from '../assets/images/logo.png';
import github from '../assets/images/github.png';
import '../assets/style/header.scss';

class Header extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      isMobel: false
    }
  }

  componentDidMount () {
  }

  handleDefEvent (event) {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  }

  openDocs (event) {
    window.open('./docs/index.html')
  }

  render () {
    return (
      <div className="header clearfix" onClick={event => this.handleDefEvent(event)}>
        <div className="navbar-header">
          <a href="" className="navbar-brand">
            <img src={logo} alt="logo" className="navbar-logo" />
          </a>
        </div>
        <div className="navbar-collapse clearfix">
          <ul className="nav navbar-nav navbar-left clearfix">
            <li id="nav-index">
              <a href="./">首页</a>
            </li>
            <li id="nav-doc" className="dropdown">
              <a href="./docs/" target="_blank" onClick={event => this.openDocs(event)}>文档</a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li id="nav-github">
              <a href="https://github.com/sakitam-fdd/ol3Echarts" target="_blank">
                <img src={github} width="18" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header;
