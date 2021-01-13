import React, { Component } from 'react';

// router-dom
import { Link, Redirect } from 'react-router-dom';

// css
import './Home.css';

// axios
import axios from 'axios';

class LogIn extends Component {
  state = {
    username: '',
    password: '',
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  inputUsername = (e) => {
    this.setState({
      username: e,
    });
  };

  inputPassword = (e) => {
    this.setState({
      password: e,
    });
  };

  onLogin = (e) => {
    e.preventDefault();
    let loginForm = new FormData();

    loginForm.append('username', this.state.username);
    loginForm.append('password', this.state.password);

    axios
      .post('https://k3d202.p.ssafy.io/api/auth/login/', loginForm, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data; boundary=---ssafy',
        },
      })
      .then(function (res) {
        alert(`${res.data.user.username}님, 환영합니다.`);
        sessionStorage.setItem('userToken', JSON.stringify(res.data.token));
        sessionStorage.setItem('userData', JSON.stringify(res.data.user));

        // window.location.replace('/');
        window.history.go(-1);
      })
      .catch(function (error) {
        // alert(`${error.message}`);
        alert('로그인에 성공하지 못했습니다.');
      });
  };

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

  appKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onLogin(e);
    }
  };

  render() {
    if (sessionStorage.getItem('userToken')) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="logbox my-5">
          <div className="loginbox">
            <div className="login">
              <form onSubmit={this.handleSubmit} noValidate>
                <div className="userid">
                  <label htmlFor="userid">아이디</label>
                  <input
                    type="userid"
                    name="userid"
                    onChange={(e) => {
                      this.inputUsername(e.target.value);
                    }}
                    noValidate
                    onKeyPress={(e) => {
                      this.appKeyPress(e);
                    }}
                  />
                </div>
                <div className="password">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    onChange={(e) => {
                      this.inputPassword(e.target.value);
                    }}
                    noValidate
                    onKeyPress={(e) => {
                      this.appKeyPress(e);
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="login-btn"
                  onClick={(e) => {
                    this.onLogin(e);
                  }}
                >
                  로그인
                </button>

                <Link
                  to="/SignUp"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    width: '100%',
                  }}
                >
                  <button type="button" className="signup-btn">
                    회원가입
                  </button>
                </Link>

                <Link
                  to="/"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    width: '100%',
                  }}
                >
                  <button
                    className="loginback-btn"
                    onClick={(e) => {
                      this.goBack();
                    }}
                  >
                    뒤로
                  </button>
                </Link>
              </form>
            </div>
          </div>

          {/* 하단 위젯 */}
          <div className="loginActions">
            <div className="adminActions">
              <input
                type="checkbox"
                name="adminToggle"
                className="adminToggle"
              />
              <a className="adminButton" href="#!">
                <i className="fa fa-cog"></i>
              </a>
              <div className="adminButtons">
                <Link to="/" title="Home">
                  <i className="fas fa-home"></i>
                </Link>
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
}

export default LogIn;
