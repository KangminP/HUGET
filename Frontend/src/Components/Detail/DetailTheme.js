import React, { Component } from 'react';

// antd
import { Alert } from 'antd';

// css
import './DetailTheme.css';

// axios
import Axios from 'axios';

class DetailTheme extends Component {
  constructor() {
    super();
    this.state = {
      theme_arr: [],
    };

    this.getRestInfo = this.getRestInfo.bind(this);
  }

  async getRestInfo() {
    const name = this.props.name;
    this.setState({
      name: name,
    });
    const data = {
      rest_name: name,
    };
    try {
      const response = await Axios.post(
        'https://k3d202.p.ssafy.io/api/auth/rest/info/',
        data,
        {
          headers: {},
        },
      );

      this.setState({ theme_arr: response.data.THEME });
    } catch (err) {
      console.log(err);
    }
  }
  componentDidMount() {
    this.getRestInfo();
  }

  render() {
    const theme = this.state.theme_arr;

    return (
      <div className="box effect">
        <div className="ml-1 mb-1 detail-box-title">테마관</div>
        <div className="ml-1 mb-2 detail-box-subtitle">
          &gt;&gt; 이색 체험을 통해 새로운 추억도 만들어 보세요.
        </div>
        {theme.length > 0 ? (
          <div className="theme-box">
            <div className="detail-box-theme-title mb-2 text-center">
              "{theme[0].theme_name}"
            </div>
            <div className="detail-box-theme-content">
              {theme[0].theme_detail}
            </div>
          </div>
        ) : (
          <Alert
            className="detail-alert"
            message="제공되는 테마 정보가 없습니다."
            type="warning"
          />
        )}
      </div>
    );
  }
}

export default DetailTheme;
