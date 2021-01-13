import React, { Component } from 'react';

// reactstrap
import { Row, Col } from 'reactstrap';

// andt
import { Alert } from 'antd';

// react-reveal
import Flip from 'react-reveal/Flip';

// css
import './DetailExfood.css';

// axios
import Axios from 'axios';

class DetailExfood extends Component {
  constructor() {
    super();
    this.state = {
      ex_arr: [],
      imgSrc: '',
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

      // console.log(response.data.EX);
      this.setState({ ex_arr: response.data.EX });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getRestInfo();
  }

  render() {
    const exfoods = this.state.ex_arr;

    if (exfoods.length) {
      return (
        <div className="box effect">
          <div className="ml-1 mb-1 detail-box-title">EX-FOOD</div>
          <div className="ml-1 mb-2 detail-box-subtitle">
            &gt;&gt; 고객과 전문가가 선택한 휴게소의 맛! 올해의 EX-FOOD
            정보입니다.
          </div>
          <Flip bottom>
            <Row>
              {exfoods.map((exfood, index) => (
                <Col key={index}>
                  <div className="card-section">
                    <img
                      src={exfood.ex_img}
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <div className="card-title">{exfood.ex_name}</div>
                      <div className="border-line"></div>
                      <div className="card-info mb-1">{exfood.ex_price}</div>
                      <div className="card-info">{exfood.ex_info}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Flip>
        </div>
      );
    } else {
      return (
        <div className="box effect">
          <div className="ml-1 mb-1 detail-box-title">EX-FOOD</div>
          <div className="ml-1 mb-2 detail-box-subtitle">
            &gt;&gt; 고객과 전문가가 선택한 휴게소의 맛! 올해의 EX-FOOD
            정보입니다.
          </div>
          <Alert
            className="detail-alert"
            message="ex-Food 메뉴가 없는 휴게소입니다."
            type="warning"
          />
        </div>
      );
    }
  }
}

export default DetailExfood;
