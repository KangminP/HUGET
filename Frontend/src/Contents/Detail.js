import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// css
import './Detail.css';

// import DetailNavbar from '../Components/Navbar/DetailNavbar';
import DetailRest from '../Components/Detail/DetailRest';
import DetailExfood from '../Components/Detail/DetailExfood';
import DetailTop from '../Components/Detail/DetailTop';
import DetailRecommend from '../Components/Detail/DetailRecommend';
import DetailConvenience from '../Components/Detail/DetailConvenience';
import DetailMenu from '../Components/Detail/DetailMenu';
import DetailComment from '../Components/Detail/DetailComment';
import DetailNavbar from '../Components/Navbar/DetailNavbar';
import DetailTheme from '../Components/Detail/DetailTheme';

// import axios from 'axios';

// scrollspy;
// window.addEventListener('DOMContentLoaded', () => {
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       const id = entry.target.getAttribute('id');
//       if (entry.intersectionRatio > 0) {
//         document
//           .querySelector(`div li a[href="#${id}"]`)
//           .parentElement.classList.add('active');
//       } else {
//         document
//           .querySelector(`div li a[href="#${id}"]`)
//           .parentElement.classList.remove('active');
//       }
//     });
//   });

//   // Track all sections that have an `id` applied
//   document.querySelectorAll('section[id]').forEach((section) => {
//     observer.observe(section);
//   });
// });

class Detail extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onLogout = () => {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userData');
    alert('성공적으로 로그아웃했습니다.');
    window.location.reload();
  };

  gotoTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const areaname = this.props.match.params.name;

    return (
      <div className="detailbox">
        <DetailNavbar />

        <div className="detail-section">
          <div className="tempBlankNav"></div>
          <div className="tempBack">
            <i
              className="text-black-50 fas fa-chevron-left"
              style={{ fontSize: '1.8rem' }}
              onClick={this.goBack}
            ></i>
          </div>
          <div id="goBasicInfo" className="tempNav">
            {areaname} 휴게소 정보입니다. 즐거운 여행 되세요.
          </div>
          <DetailRest name={areaname} />
          <DetailConvenience name={areaname} />
          <DetailTop name={areaname} />

          <div id="goServiceInfo" className="tempNav">
            {areaname} 휴게소에서만 누릴 수 있는 즐거움!!
          </div>
          <DetailExfood name={areaname} />
          <DetailRecommend name={areaname} />
          <DetailMenu name={areaname} />
          <DetailTheme name={areaname} />

          <div id="goCommentInfo" className="tempNav">
            후기를 남겨보세요.
          </div>
          <DetailComment name={areaname} />
        </div>

        {/* 하단 위젯 */}
        <div className="detailActions">
          <div className="adminActions">
            <input type="checkbox" name="adminToggle" className="adminToggle" />
            <a className="adminButton">
              <i className="fa fa-cog"></i>
            </a>
            <div className="adminButtons">
              <Link to="/" title="Home">
                <i className="fas fa-home"></i>
              </Link>
              {sessionStorage.getItem('userToken') ? (
                <>
                  <Link to="/EditUser" title="Edit User">
                    <i className="fas fa-user"></i>
                  </Link>
                  <a
                    className="logout-btn"
                    title="Logout"
                    onClick={(e) => {
                      this.onLogout();
                    }}
                  >
                    <i className="fas fa-power-off"></i>
                  </a>
                </>
              ) : (
                <>
                  <Link to="/Login" title="Login">
                    <i className="fas fa-sign-in-alt"></i>
                  </Link>
                </>
              )}

              <a
                className="gototop-btn"
                title="Top"
                onClick={(e) => {
                  this.gotoTop();
                }}
              >
                <i className="fas fa-chevron-up"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Detail;
