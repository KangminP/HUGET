import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// Naver Map
import { NaverMap, Marker } from 'react-naver-maps';

// Axios
import Axios from 'axios';

// Ant Design
import { Select, Drawer } from 'antd';
import 'antd/dist/antd.css';

// css
import './Search.css';

class Search extends Component {
  constructor() {
    super();
    this.state = {
      // 좌표 관련
      currentLat: '',
      currentLng: '',
      showMyPosition: false,

      // 휴게소 데이터
      restData: [],
      selectedRest: '',
      selectedRestLat: 0,
      selectedRestLng: 0,

      // Drawer
      visible: false,
      placement: 'bottom',
      restDrawerInfo: {},

      // 네이버 지도 옵션
      // defaults
      zoomControl: false, //줌 컨트롤의 표시 여부
      zoomControlOptions: {
        //줌 컨트롤의 옵션
        position: window.naver.maps.Position.TOP_RIGHT,
      },

      // interaction
      draggable: true,
      pinchZoom: true,
      scrollWheel: true,
      keyboardShortcuts: true,
      disableDoubleTapZoom: false,
      disableDoubleClickZoom: false,
      disableTwoFingerTapZoom: false,

      // controls
      scaleControl: true,
      logoControl: true,
      mapDataControl: true,
      mapTypeControl: false,
    };

    this.toggleInteraction = this.toggleInteraction.bind(this);
    this.toggleControl = this.toggleControl.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onDrawerClose = this.onDrawerClose.bind(this);

    this.getRestInfo = this.getRestInfo.bind(this);
  }

  toggleInteraction() {
    if (this.state.draggable) {
      this.setState({
        draggable: false,
        pinchZoom: false,
        scrollWheel: false,
        keyboardShortcuts: false,
        disableDoubleTapZoom: true,
        disableDoubleClickZoom: true,
        disableTwoFingerTapZoom: true,
      });
    } else {
      this.setState({
        draggable: true,
        pinchZoom: true,
        scrollWheel: true,
        keyboardShortcuts: true,
        disableDoubleTapZoom: false,
        disableDoubleClickZoom: false,
        disableTwoFingerTapZoom: false,
      });
    }
  }

  toggleControl() {
    if (this.state.scaleControl) {
      this.setState({
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
        zoomControl: false,
        mapTypeControl: false,
      });
    } else {
      this.setState({
        scaleControl: true,
        logoControl: true,
        mapDataControl: true,
        zoomControl: true,
        mapTypeControl: true,
      });
    }
  }

  // Drawer Control
  showDrawer() {
    this.setState({
      visible: true,
    });
  }

  onDrawerClose() {
    this.setState({
      visible: false,
    });
  }

  // 현재 위치 정보 읽어옴
  getUserLocation() {    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currentLat: position.coords.latitude,
            currentLng: position.coords.longitude,
          });
        },
        function (error) {
          alert('위치 정보를 읽어올 수 없습니다!')
        },
        { enableHighAccuracy: true },
      );
    } else {
      alert('위치 정보를 읽어올 수 없습니다!')
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getRestInfo();
    // this.getUserLocation()
  }

  async getRestInfo() {
    try {
      const response = await Axios.get(
        'https://k3d202.p.ssafy.io/api/auth/rest/',
      );
      let restInfo = [];
      for (var rest of response.data) {
        let restObj = {
          value: rest.rest_name,
          rest_name: rest.rest_name,
          rest_address: rest.rest_address,
          rest_tel: rest.rest_tel,
          rest_high: rest.rest_high,
          rest_highdirect: rest.rest_highdirect,
          rest_lat: Number(
            rest.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
          ),
          rest_lng: Number(
            rest.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
          ),
        };
        restInfo.push(restObj);
      }
      this.setState({
        restData: restInfo,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const navermaps = window.naver.maps;
    const restOptions = this.state.restData;

    return (
      <>
        <div className="homebox my-5 w-100">
          <div className="w-100 mx-0">
            <div className="search-area-header">
              <div>
                <Link to="/" style={{ height: '100%' }}>
                  <i
                    className="text-black-50 fas fa-chevron-left"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                </Link>
              </div>
              <div className="area-title">휴게소 검색</div>
            </div>
            <div className="search-area-box my-3">
              <div className="searcharea">
                <div className="area-input">
                  <Select
                    showSearch
                    options={restOptions}
                    style={{ width: '100%' }}
                    size={'large'}
                    placeholder="휴게소를 입력해주세요."
                    optionFilterProp="value"
                    onChange={(e) => {
                      for (var rest of this.state.restData) {
                        if (rest.value === e) {
                          this.setState({
                            selectedRest: rest,
                          });
                          // this.setState({
                          //   selectedRestLat: rest.rest_lat,
                          //   selectedRestLng: rest.rest_lng
                          // })
                        }
                      }
                    }}
                    filterOption={(input, option) =>
                      option.value.indexOf(input) >= 0
                    }
                  />
                </div>
              </div>
              <div className="mylocation">
                {this.state.showMyPosition ? (
                  <>
                    <button
                      className="btn btn-info mylocation-btn"
                      title="내 위치"
                      onClick={(e) => {
                        if (this.state.showMyPosition === false) {
                          this.setState({
                            showMyPosition: true,
                          });
                        } else {
                          this.setState({
                            showMyPosition: false,
                          });
                        }
                      }}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-info mylocation-btn"
                      title="내 위치"
                      onClick={(e) => {
                        if (this.state.showMyPosition === false) {
                          this.getUserLocation()
                          this.setState({
                            showMyPosition: true,
                          });
                        } else {
                          this.setState({
                            showMyPosition: false,
                          });
                        }
                      }}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mapDiv d-flex text-center">
              <NaverMap
                mapDivId={'react-naver-map1'}
                style={{
                  width: '100%',
                  height: '75vh',
                }}
                defaultCenter={{ lat: 36.3504119, lng: 127.8845475 }}
                defaultZoom={7}
                minZoom={7}
                naverRef={(ref) => {
                  this.mapRef = ref;
                }}
                {...this.state}
              >
                {/* 현재 위치 마커 */}
                {this.state.showMyPosition === true ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(
                          Number(this.state.currentLat),
                          Number(this.state.currentLng),
                        )
                      }
                      title="내 위치"
                      icon={{
                        url:
                          'https://navermaps.github.io/maps.js/docs/img/example/pin_default.png',
                        size: new navermaps.Size(24, 37),
                        anchor: new navermaps.Point(12, 37),
                      }}
                      animation={navermaps.Animation.BOUNCE}
                    />
                  </>
                ) : (
                  <></>
                )}

                {/* 휴게소 마커 & Drawer */}
                {this.state.selectedRest ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(
                          Number(this.state.selectedRest.rest_lat),
                          Number(this.state.selectedRest.rest_lng),
                        )
                      }
                      title={this.state.selectedRest.value}
                      onClick={(e) => {
                        this.mapRef.setZoom(7);
                        this.mapRef.setCenter(new navermaps.LatLng(Number(this.state.selectedRest.rest_lat)-1, Number(this.state.selectedRest.rest_lng)));
                        this.showDrawer();
                      }}
                    />
                    <Drawer
                      title={this.state.selectedRest.rest_name + ' 휴게소'}
                      placement={this.state.placement}
                      closable={false}
                      height="14rem"
                      maskStyle={{ backgroundColor: 'transparent' }}
                      onClose={this.onDrawerClose}
                      visible={this.state.visible}
                      key={this.state.placement}
                      className="drawertitle"
                    >
                      <div className="draweraddress">
                        <i className="fas fa-building"></i>&nbsp;&nbsp;
                        {this.state.selectedRest.rest_address}
                      </div>
                      <div className="drawertel">
                        <i className="fas fa-phone-alt"></i>&nbsp;&nbsp;
                        {this.state.selectedRest.rest_tel}
                      </div>
                      <Link to={`Detail/${this.state.selectedRest.value}`}>
                        <div className="drawerdetail">자세히 보기</div>
                      </Link>
                    </Drawer>
                  </>
                ) : (
                  <></>
                )}
              </NaverMap>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Search;
