import React, { Component } from 'react';

import './DetailNavbar.css';

class DetailNavbar extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  goBasicInfo = () => {
    // document.getElementById('goServiceInfo').scrollIntoView();
    const id = 'goBasicInfo';
    const yOffset = -60; 
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
  };

  goServiceInfo = () => {
    const id = 'goServiceInfo';
    const yOffset = -60; 
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
  };

  goCommentInfo = () => {
    const id = 'goCommentInfo';
    const yOffset = -60; 
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({top: y, behavior: 'smooth'});
  };

  render() {
    return (
      <>
        <div className="catemenu">
          <ul>
            <li className="cateitem">
              {/* <a href="#info">기본정보</a> */}
              <button onClick={this.goBasicInfo}>기본정보</button>
            </li>
            <li className="cateitem">
              {/* <a href="#service">여기서만!</a> */}
              <button onClick={this.goServiceInfo}>여기서만!</button>
            </li>
            <li className="last cateitem">
              {/* <a href="#comment">후기</a> */}
              <button onClick={this.goCommentInfo}>후기</button>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export default DetailNavbar;
