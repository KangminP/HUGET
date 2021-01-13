import React, { Component } from 'react';

// router-dom
import { Link, Redirect } from 'react-router-dom';

// css
import './EditUser.css';

// axios
import axios from 'axios';

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      isIdValid: true,
      password: '',
      isPasswordValid: false,
      email: '',
      isEmailValid: false,
      nickname: '',
      isNicknameValid: false,
      page: '',
    };
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async getUserInfo() {
    const token = JSON.parse(sessionStorage.getItem('userToken'));
    try {
      const res = await axios.get('https://k3d202.p.ssafy.io/api/auth/user/', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: `Token ${token}`,
        },
      });
      this.setState({
        id: res.data.username,
        email: res.data.email,
        nickname: res.data.nickname,
      });
    } catch (err) {
      console.log(err);
    }
    this.validateId(this.state.id);
    this.validateNickname(this.state.nickname);
    this.validateEmail(this.state.email);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  inputClassNameHelper = (boolean) => {
    switch (boolean) {
      case true:
        return 'is-valid';
      case false:
        return 'is-invalid';
      default:
        return '';
    }
  };

  setId = (e) => {
    this.setState({
      id: e,
    });
  };

  setPassword = (e) => {
    this.setState({
      password: e,
    });
  };

  setPassword_confirm = (e) => {
    this.setState({
      password2: e,
    });
  };

  setEmail = (e) => {
    this.setState({
      email: e,
    });
  };

  setNickname = (e) => {
    this.setState({
      nickname: e,
    });
  };

  onFormSubmit = (e) => {
    let updateForm = new FormData();
    const token = JSON.parse(sessionStorage.getItem('userToken'));
    updateForm.append('email', this.state.email);
    updateForm.append('password', this.state.password);
    updateForm.append('nickname', this.state.nickname);

    sessionStorage.setItem('tmpid', this.state.id);
    sessionStorage.setItem('tmppw', this.state.password);
    axios
      .put('https://k3d202.p.ssafy.io/api/auth/user/profile/', updateForm, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data; boundary=---ssafy',
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          page: 'redirect',
        });
        alert('성공적으로 수정했습니다.');
        window.history.go(-1);
      })
      .catch((err) => {
        alert(err);
      });
  };

  // ID 검증
  validateId = (idEntered) => {
    this.setState({
      isIdValid: true,
      idEntered: true,
    });
  };
  isEnteredIdValid = () => {
    const { idEntered, isIdValid } = this.state;
    if (idEntered) return isIdValid;
  };
  renderIdFeedbackMessage() {
    const { isIdValid } = this.state;
    if (!isIdValid) {
      return (
        <div className="invalid-feedback">ID를 7자 이상 입력해주세요.</div>
      );
    }
  }

  // PW 검증
  validatePassword = (passwordEntered) => {
    if (passwordEntered.length >= 6) {
      this.setState({
        isPasswordValid: true,
        passwordEntered,
      });
    } else {
      this.setState({
        isPasswordValid: false,
        passwordEntered,
      });
    }
  };
  isEnteredPasswordValid = () => {
    const { passwordEntered, isPasswordValid } = this.state;
    if (passwordEntered) return isPasswordValid;
  };

  // PW,PW2 비교검증
  handleOnPasswordInput(InputPassword) {
    this.setState({ password: InputPassword });
  }
  handleOnConfirmPasswordInput(InputPasswordConfirm) {
    this.setState({ password2: InputPasswordConfirm });
  }
  doesPasswordMatch() {
    const { password, password2 } = this.state;
    return password === password2;
  }
  confirmPasswordClassName() {
    const { password2 } = this.state;
    if (password2) {
      return this.doesPasswordMatch() ? 'is-valid' : 'is-invalid';
    }
  }
  renderPasswordFeedbackMessage() {
    const { isPasswordValid } = this.state;
    if (!isPasswordValid) {
      return (
        <div className="invalid-feedback">
          비밀번호는 6자 이상이어야 합니다.
        </div>
      );
    }
  }
  renderPasswordConfirmFeedbackMessage() {
    const { password2 } = this.state;
    if (password2) {
      if (!this.doesPasswordMatch()) {
        return (
          <div className="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
        );
      }
    }
  }

  // Email 검증
  validateEmail = (emailEntered) => {
    const regMail = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);

    if (emailEntered.match(regMail)) {
      this.setState({
        isEmailValid: true,
        emailEntered,
      });
    } else {
      this.setState({
        isEmailValid: false,
        emailEntered,
      });
    }
  };
  isEnteredEmailValid = () => {
    const { emailEntered, isEmailValid } = this.state;
    if (emailEntered) return isEmailValid;
  };
  renderEmailFeedbackMessage() {
    const { isEmailValid } = this.state;
    if (!isEmailValid) {
      return (
        <div className="invalid-feedback">이메일 형식이 올바르지 않습니다.</div>
      );
    }
  }

  // Nickname 검증
  validateNickname = (nicknameEntered) => {
    const regNick = /^[가-힣A-Za-z0-9]{4,12}$/;

    if (nicknameEntered.match(regNick)) {
      this.setState({
        isNicknameValid: true,
        nicknameEntered,
      });
    } else {
      this.setState({
        isNicknameValid: false,
        nicknameEntered,
      });
    }
  };
  isEnteredNicknameValid = () => {
    const { nicknameEntered, isNicknameValid } = this.state;
    if (nicknameEntered) return isNicknameValid;
  };
  renderNicknameFeedbackMessage() {
    const { isNicknameValid } = this.state;
    if (!isNicknameValid) {
      return (
        <div className="invalid-feedback">
          닉네임은 4~12자의 한글, 영문, 숫자 조합입니다.
        </div>
      );
    }
  }

  // id, password, password2, email, nickname 다 맞는지 검증
  isEveryBasicFieldValid = () => {
    const {
      // isIdValid,
      isEmailValid,
      isPasswordValid,
      isNicknameValid,
    } = this.state;
    return (
      // isIdValid &&
      isNicknameValid &&
      isEmailValid &&
      isPasswordValid &&
      this.doesPasswordMatch()
    );
  };

  // button 활성화
  renderSubmitBasicBtn = () => {
    if (this.isEveryBasicFieldValid()) {
      return (
        <button
          className="edit-btn"
          onClick={(e) => {
            e.preventDefault();
            this.onFormSubmit();
          }}
        >
          수정완료
        </button>
      );
    } else {
      return (
        <>
          <div className="edit-btn-disabled text-center">
            올바른 수정 후에 활성화됩니다.
          </div>
        </>
      );
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    // if (this.state.page === 'redirect') {
    //   return <Redirect to="/" />;
    // } else {
    return (
      <div className="regibox my-5">
        <form noValidate>
          <div className="form-group">
            <label className="signup-form-label reqField" htmlFor="inputId">
              아이디
            </label>
            <input
              type="text"
              id="inputId"
              disabled
              defaultValue={this.state.id}
              className={`form-control is-valid ${this.inputClassNameHelper(
                this.isEnteredIdValid(),
              )}`}
              onChange={(e) => {
                this.setId(e.target.value);
                this.validateId(e.target.value);
              }}
            />
            {this.renderIdFeedbackMessage()}
          </div>

          <div className="form-group">
            <label
              className="signup-form-label reqField"
              htmlFor="inputPassword"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="inputPassword"
              defaultValue={this.state.password}
              className={`form-control ${this.inputClassNameHelper(
                this.isEnteredPasswordValid(),
              )}`}
              onChange={(e) => {
                this.setPassword(e.target.value);
                this.validatePassword(e.target.value);
                this.handleOnPasswordInput(e.target.value);
              }}
            />
            {this.renderPasswordFeedbackMessage()}
          </div>

          <div className="form-group">
            <label
              className="signup-form-label reqField"
              htmlFor="inputPassword2"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="inputPassword2"
              defaultValue={this.state.password2}
              className={`form-control ${this.confirmPasswordClassName()}`}
              onChange={(e) => {
                this.handleOnConfirmPasswordInput(e.target.value);
              }}
            />
            {this.renderPasswordConfirmFeedbackMessage()}
          </div>

          <div className="form-group">
            <label
              className="signup-form-label reqField"
              htmlFor="inputNickname"
            >
              닉네임
            </label>
            <input
              type="text"
              id="inputNickname"
              defaultValue={this.state.nickname}
              className={`form-control ${this.inputClassNameHelper(
                this.isEnteredNicknameValid(),
              )}`}
              onChange={(e) => {
                this.setNickname(e.target.value);
                this.validateNickname(e.target.value);
              }}
            />
            {this.renderNicknameFeedbackMessage()}
          </div>

          <div className="form-group">
            <label className="signup-form-label reqField" htmlFor="inputEmail">
              이메일
            </label>
            <input
              type="email"
              id="inputEmail"
              defaultValue={this.state.email}
              className={`form-control ${this.inputClassNameHelper(
                this.isEnteredEmailValid(),
              )}`}
              onChange={(e) => {
                this.setEmail(e.target.value);
                this.validateEmail(e.target.value);
              }}
            />
            {this.renderEmailFeedbackMessage()}
          </div>

          {this.renderSubmitBasicBtn()}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'white',
              width: '100%',
            }}
          >
            <button
              className="editback-btn"
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
  // }
}

export default EditUser;
