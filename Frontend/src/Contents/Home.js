import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// css
import './Home.css';

class Home extends Component {
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

  render() {
    return (
      <div className="mainbox">
        <div className="logobox">
          <div className="logotitle">
            <img src={require('../Assets/Images/logo.png')} alt="" />
            <span>Hu:Get</span>
          </div>
        </div>

        <div className="img-box">
          <img
            className="mainImg"
            src={require('../Assets/Images/window.jpg')}
            alt="highway"
          />
          <div className="img-border"></div>
          <div className="img-title">휴겟(Hu:get)</div>
          <div className="img-content">
            휴게소 정보를 통해 즐거운 여행되십시오.
          </div>
        </div>

        <div className="intro">
          <div>&#8251; 4가지 카테고리로 정보를 제공하고 있습니다.</div>
        </div>

        <div className="oddbox row">
          <div className="pr-0 col-4">
            <img src={require('../Assets/Images/restareah.jpg')} alt="" />
          </div>
          <div className="pl-0 col-8">
            <div className="titleback1">
              <Link
                to="/Search"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <div className="eventitle d-flex justify-content-center align-items-center">
                  <div className="px-2 text-dark">휴게소 검색</div>
                  <div className="px-1">
                    <i className="fas fa-arrow-circle-right fa-lg"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="evenbox row">
          <div className="pr-0 col-8">
            <div className="titleback2">
              <Link
                to="/Highway"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <div className="eventitle d-flex justify-content-center align-items-center">
                  <div className="px-2 text-dark">고속도로 선택</div>
                  <div className="px-1">
                    <i className="fas fa-arrow-circle-right fa-lg"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="pl-0 col-4">
            <img src={require('../Assets/Images/highwayh.jpg')} alt="" />
          </div>
        </div>

        <div className="oddbox row">
          <div className="pr-0 col-4">
            <img src={require('../Assets/Images/rooth.jpg')} alt="" />
          </div>
          <div className="pl-0 col-8">
            <div className="titleback3">
              <Link
                to="/Root"
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <div className="eventitle d-flex justify-content-center align-items-center">
                  <div className="px-2 text-dark">경로상 탐색</div>
                  <div className="px-1">
                    <i className="fas fa-arrow-circle-right fa-lg"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="evenbox row">
          <div className="pr-0 col-8">
            <div className="titleback4">
              <Link
                to="/SearchMenu"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                }}
              >
                <div className="eventitle d-flex justify-content-center align-items-center">
                  <div className="px-2 text-dark">먹거리 검색</div>
                  <div className="px-1">
                    <i className="fas fa-arrow-circle-right fa-lg"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="pl-0 col-4">
            <img src={require('../Assets/Images/menuh.jpg')} alt="" />
          </div>
        </div>

        {/* <div className="img-box d-flex justify-content-center">
          <img
            className="mainImg"
            src={require('../Assets/Images/area.jpg')}
            alt="highway"
          />
        </div>
        <div className="btnbox">
          <Link
            to="/Search"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            휴게소 검색
          </Link>
          <Link
            to="/Highway"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            고속도로 선택
          </Link>
          <Link
            to="/Root"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            경로 탐색
          </Link>
          <Link
            to="/SearchMenu"
            className="btn-3d"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            음식 찾기
          </Link>
        </div>

        {/* 하단 위젯 */}
        <div className="homeActions">
          <div className="adminActions">
            <input type="checkbox" name="adminToggle" className="adminToggle" />
            <a className="adminButton" href="#!">
              <i className="fa fa-cog"></i>
            </a>
            <div className="adminButtons">
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

export default Home;
