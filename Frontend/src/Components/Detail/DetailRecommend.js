import React, { Component } from 'react';

// reactstrap
import { Row, Col } from 'reactstrap';

// antd
import { Alert } from 'antd';

// css
import './DetailRecommend.css';

// react-reveal
import Roll from 'react-reveal/Roll';
import Fade from 'react-reveal/Fade';

// axios
import Axios from 'axios';

class DetailRecommend extends Component {
  constructor() {
    super();
    this.state = {
      menu_arr: [],
      best_arr: [],
    };

    this.getRestInfo = this.getRestInfo.bind(this);
  }

  async getRestInfo() {
    const name = this.props.name;
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

      // console.log(response.data.food);
      this.setState({ menu_arr: response.data.food });

      const collect_arr = [];
      const temp_menu_arr = this.state.menu_arr;
      for (var i = 0; i < temp_menu_arr.length; i++) {
        // console.log(temp_menu_arr[i]);
        if (temp_menu_arr[i].menu_best === 'Y') {
          collect_arr.push(temp_menu_arr[i]);
        }
      }

      this.setState({ best_arr: collect_arr });
      // console.log(this.state.best_arr);
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getRestInfo();
  }

  render() {
    const bestmenus = this.state.best_arr;
    const bestList = bestmenus.map((best, index) => (
      <div key={index} className="npbox">
        <div className="namebox">{best.menu_name}</div>
        <div className="pricebox">&#8361; {best.menu_price}</div>
      </div>
    ));

    return (
      <div className="box effect">
        <div className="ml-1 mb-1 detail-box-title">베스트 메뉴</div>
        <div className="ml-1 mb-3 detail-box-subtitle">&gt;&gt; 이 휴게소에서 추천하는 베스트 메뉴입니다.</div>
        {bestmenus.length > 0 ? (
          <Row className="under376 over376">
            <div className="bestimgbox">
              <Roll>
                <img
                  className="bestimg"
                  src={require('../../Assets/Images/recommend.png')}
                  alt=""
                />
              </Roll>
            </div>
            <div className="bestbox">
              <Row className="w-100 mx-0">
                {bestList}
              </Row>
            </div>
          </Row>
        ) : (
          <Alert
            className="detail-alert"
            message="베스트 메뉴 정보가 없습니다."
            type="warning"
          />
        )}
        {/* <Row className="under376 over376">
          <div className="bestimgbox">
            <Roll>
              <img
                className="bestimg"
                src={require('../../Assets/Images/recommend.png')}
                alt=""
              />
            </Roll>
          </div>
          <div className="bestbox">
            <Row className="w-100 mx-0">{bestList}</Row>
          </div>
        </Row> */}
      </div>
    );
  }
}

export default DetailRecommend;
