import React, { Component } from 'react';

// css
import './DetailRest.css';

// axios
import Axios from 'axios';

class DetailRest extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      address: '',
      tel: '',
      highway: '',
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

      this.setState({
        name: response.data.rest[0].rest_name,
        address: response.data.rest[0].rest_address,
        tel: response.data.rest[0].rest_tel,
        highway: response.data.rest[0].rest_high,
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getRestInfo();
  }

  render() {
    const name = this.state.name;
    const address = this.state.address;
    const tel = this.state.tel;
    const highway = this.state.highway;
    return (
      <div className="box effect detail-rest-box">
        <div className="ml-1 mb-3 detail-box-title">{name} 휴게소 정보</div>
        <div className="ml-1">주소 : {address}</div>
        <div className="ml-1">Tel : {tel}</div>
        <div className="ml-1">고속도로 : {highway}</div>
      </div>
    );
  }
}

export default DetailRest;
