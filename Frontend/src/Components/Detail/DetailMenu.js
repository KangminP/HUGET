import React, { Component } from 'react';

// antd
import { Modal, Button, Alert } from 'antd';

// css
import './DetailMenu.css';

// react-reveal
import Fade from 'react-reveal/Fade';

// axios
import Axios from 'axios';

class DetailTop extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      menu_arr: [],
      brand_arr: [],
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
      // console.log(this.state.menu_arr);
    } catch (err) {
      console.log(err);
    }
  }

  async getRestBrand() {
    const name = this.props.name;
    this.setState({
      name: name,
    });
    const data = {
      rest_name: name,
    };
    try {
      const response = await Axios.post(
        'https://k3d202.p.ssafy.io/api/auth/rest/brand/',
        data,
        {
          headers: {},
        },
      );

      // console.log(response.data);
      this.setState({ brand_arr: response.data });
      // console.log(this.state.brand_arr);
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getRestInfo();
    this.getRestBrand();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const menus = this.state.menu_arr;
    const menuList = menus.map((menu, index) => {
      if (menu.menu_best !== 'Y') {
        return (
          <div key={index} className="block">
            <div key={index} className="menu-items">
              {menu.menu_name}
              <span className="price">{menu.menu_price}원</span>
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="block">
            <div key={index} className="menu-items-best">
              &nbsp;
              <i className="fas fa-star"></i>&nbsp;
              {menu.menu_name}
              <span className="price">{menu.menu_price}원</span>
            </div>
          </div>
        );
      }
    });

    const brands = this.state.brand_arr;
    const brandList = brands.map((brand, index) => {
      return (
        <li className="table-row" key={index}>
          <div className="col col-a" data-label="Brand">
            {brand.brand_name}
          </div>
          <div className="col col-b" data-label="Time">
            {brand.brand_opentime} - {brand.brand_closetime}
          </div>
          <div className="col col-c" data-label="Info">
            {brand.brand_info !== null ? (
              <div>{brand.brand_info}</div>
            ) : (
              <div>매장정보 내용이 없습니다.</div>
            )}
          </div>
        </li>
      );
    });

    return (
      <div className="box effect">
        <div className="ml-1 mb-1 detail-box-title">식당정보</div>
        <div className="ml-1 mb-2 detail-box-subtitle">
          &gt;&gt; 휴게소에서 판매중인 메뉴 정보입니다.
        </div>
        <div className="d-flex justify-content-center">
          <Button onClick={this.showModal} className="menu-btn mb-3">
            휴게소 전체 메뉴 보기
          </Button>
          <Modal
            title="메뉴 및 가격"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            style={{ width: '1.5vw' }}
            footer={[
              <Button key="back" type="primary" onClick={this.handleCancel}>
                OK
              </Button>,
            ]}
          >
            {menuList}
          </Modal>
        </div>

        <div className="ml-1 mb-1 detail-box-title">매장정보</div>
        <div className="ml-1 mb-2 detail-box-subtitle">
          &gt;&gt; 휴게소에서 입점 중인 매장 정보입니다.
        </div>
        {this.state.brand_arr.length > 0 ? (
          <>
            <div className="tablebox detail-brand-box">
              <Fade bottom cascade>
                <div className="responsive-table">
                  <li className="table-header">
                    <div className="col col-a">Brand</div>
                    <div className="col col-b">Time</div>
                    <div className="col col-c">Info</div>
                  </li>

                  {brandList}
                </div>
              </Fade>
            </div>
          </>
        ) : (
          <Alert
            className="detail-alert"
            message="입점된 브랜드가 존재하지 않습니다."
            type="warning"
          />
        )}
      </div>
    );
  }
}

export default DetailTop;
