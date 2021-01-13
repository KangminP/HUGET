import React, { Component } from 'react';

// router-dom
import { Link, Redirect } from 'react-router-dom';

// css
import './SignUp.css';

// axios
import axios from 'axios';

// 유효성 정규식
const regId = /^[a-z0-9]{4,12}$/;
const regNick = /^[가-힣A-Za-z0-9]{4,12}$/;
const regMail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

// 유효성 검사
// 에러가 있으면 발생
const formValid = (isError) => {
  let isValid = true;
  Object.values(isError).forEach((val) => val.length > 0 && (isValid = false));
  return isValid;
};
// 빈칸이 있으면 발생
const blankValid = ({ isError, ...rest }) => {
  let isValid = true;
  Object.values(rest).forEach((val) => val === '' && (isValid = false));
  return isValid;
};

class SignUp extends Component {
  state = {
    nickname: '',
    email: '',
    id: '',
    password: '',
    password2: '',

    // formValid: false,
    // errorCount: null,
    isError: {
      nickname: '',
      email: '',
      id: '',
      password: '',
      password2: '',
    },
  };

  onSubmit = (e) => {
    e.preventDefault();
    // if (validateForm(this.state.isError)) {
    //   console.log(this.state);
    // } else {
    //   console.log('sorry');
    // }
    // this.setState({ formValid: validateForm(this.state.isError) });
    // this.setState({ errorCount: countErrors(this.state.isError) });

    if (formValid(this.state.isError) && blankValid(this.state)) {
      // console.log(this.state);

      let signupForm = new FormData();
      signupForm.append('username', this.state.id);
      signupForm.append('email', this.state.email);
      signupForm.append('password', this.state.password);
      signupForm.append('nickname', this.state.nickname);

      sessionStorage.setItem('tmpid', this.state.id);
      sessionStorage.setItem('tmppw', this.state.password);

      axios
        .post('https://k3d202.p.ssafy.io/api/auth/register/', signupForm, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data; boundary=---ssafy',
          },
        })
        .then((res) => {
          // console.log(res.data);
          let loginForm = new FormData();
          loginForm.append('username', sessionStorage.getItem('tmpid'));
          loginForm.append('password', sessionStorage.getItem('tmppw'));

          axios
            .post('https://k3d202.p.ssafy.io/api/auth/login/', loginForm, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data; boundary=---ssafy',
              },
            })
            .then((res) => {
              alert(
                `${sessionStorage.getItem('tmpid')} 님, 가입을 축하드립니다.`,
              );
              sessionStorage.removeItem('tmpid');
              sessionStorage.removeItem('tmppw');
              sessionStorage.setItem(
                'userToken',
                JSON.stringify(res.data.token),
              );
              sessionStorage.setItem('userData', JSON.stringify(res.data.user));
              window.location.replace('/');
            })
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      // console.log('invalid!');
      alert('회원가입에 실패했습니다.');
    }
    // if (blankValid(this.state)) {
    //   console.log(this.state);
    // } else {
    //   console.log('Sorry!');
    // }
  };

  formValChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let isError = { ...this.state.isError };

    switch (name) {
      case 'nickname':
        isError.nickname = regNick.test(value)
          ? ''
          : '닉네임은 4~12자의 한글, 영문, 숫자 조합입니다.';
        break;
      case 'email':
        isError.email = regMail.test(value)
          ? ''
          : '이메일 형식이 올바르지 않습니다.';
        break;
      case 'id':
        // isError.id = value.length < 4 ? '아이디는 4자 이상 입력해주세요.' : '';
        isError.id = regId.test(value)
          ? ''
          : '아이디는 4~12자의 영문과 숫자로만 입력 가능합니다.';
        break;
      case 'password':
        isError.password =
          value.length < 6 ? '비밀번호는 6자 이상이어야 합니다.' : '';
        if (value.length >= 6) {
          this.setState({ password: value });
          //   console.log(this.state.password);
        }
        isError.password2 =
          value !== this.state.password2 ? '비밀번호가 일치하지 않습니다.' : '';
        break;
      case 'password2':
        isError.password2 =
          value !== this.state.password ? '비밀번호가 일치하지 않습니다.' : '';
        // if (value === this.state.password) {
        this.setState({ password2: value });
        // }
        break;
      default:
        break;
    }

    this.setState({
      isError,
      [name]: value,
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { isError } = this.state;
    if (sessionStorage.getItem('userToken')) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="regibox my-5">
          {/* <div className="d-flex justify-content-center">
          <h3>회원가입 화면입니다.</h3>
        </div> */}
          <form onSubmit={this.onSubmit} noValidate>
            <div className="form-group">
              <label>아이디</label>
              <input
                type="text"
                className={
                  isError.id.length > 0
                    ? 'is-invalid form-control'
                    : 'form-control'
                }
                name="id"
                onChange={this.formValChange}
              />
              {isError.id.length > 0 && (
                <span className="invalid-feedback">{isError.id}</span>
              )}
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                className={
                  isError.password.length > 0
                    ? 'is-invalid form-control'
                    : 'form-control'
                }
                name="password"
                onChange={this.formValChange}
              />
              {isError.password.length > 0 && (
                <span className="invalid-feedback">{isError.password}</span>
              )}
            </div>

            <div className="form-group">
              <label>비밀번호 확인</label>
              <input
                type="password"
                className={
                  isError.password2.length > 0
                    ? 'is-invalid form-control'
                    : 'form-control'
                }
                name="password2"
                onChange={this.formValChange}
              />
              {isError.password2.length > 0 && (
                <span className="invalid-feedback">{isError.password2}</span>
              )}
            </div>

            <div className="form-group">
              <label>닉네임</label>
              <input
                type="text"
                className={
                  isError.nickname.length > 0
                    ? 'is-invalid form-control'
                    : 'form-control'
                }
                name="nickname"
                onChange={this.formValChange}
              />
              {isError.nickname.length > 0 && (
                <span className="invalid-feedback">{isError.nickname}</span>
              )}
            </div>

            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                className={
                  isError.email.length > 0
                    ? 'is-invalid form-control'
                    : 'form-control'
                }
                name="email"
                onChange={this.formValChange}
              />
              {isError.email.length > 0 && (
                <span className="invalid-feedback">{isError.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="create-btn"
              onClick={(e) => {
                this.onSubmit(e);
              }}
            >
              작성 완료
            </button>
            <Link
              to="/Login"
              style={{ textDecoration: 'none', color: 'white', width: '100%' }}
            >
              <button
                className="regiback-btn"
                onClick={(e) => {
                  this.goBack();
                }}
              >
                뒤로
              </button>
            </Link>
          </form>
        </div>
      );
    }
  }
}

export default SignUp;
