import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// Naver Map
import { NaverMap, Marker, Polyline } from 'react-naver-maps';

// Papaparse
import Papa from 'papaparse';

// Axios
import Axios from 'axios';

// Ant Design
import { Select, Drawer } from 'antd';
import 'antd/dist/antd.css';

// css
import './Highway.css';

class HighwayInfo extends Component {
  constructor() {
    super();
    this.state = {
      // 좌표 관련
      currentLat: '',
      currentLng: '',
      showMyPosition: false,

      // 도로 데이터 관련
      data: [],
      newData: [],
      newData2: [],
      roadSelection: '',
      roadDir: ['상행', '하행'],
      myDir: '',

      // 휴게소 정보
      restData: [],
      restCoord: [],

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
    this.getData = this.getData.bind(this);
    this.filterRoad = this.filterRoad.bind(this);
    this.onRoadFilter = this.onRoadFilter.bind(this);
    this.onRoadDirFilter = this.onRoadDirFilter.bind(this);

    this.showDrawer = this.showDrawer.bind(this);
    this.onDrawerClose = this.onDrawerClose.bind(this);
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
    // 도로 데이터 CSV 불러오기
    this.getCsvData();
  }

  // import CSV
  async getCsvData() {
    let csvData = [];
    await fetch('../../data/HighwayData_2019_UTF-8.csv')
      .then((response) => response.text())
      .then((text) => {
        csvData = text;
      });
    Papa.parse(csvData, {
      encoding: 'utf-8',
      complete: this.getData,
    });
  }
  getData(result) {
    this.setState({ data: result.data });
  }

  // 고속도로 보기
  async onRoadFilter(e) {
    const navermaps = window.naver.maps;
    this.mapRef.setZoom(7);
    this.mapRef.setCenter(new navermaps.LatLng(36.3504119, 127.8845475));
    await this.setState({
      roadSelection: e,
      myDir: '',
      restData: [],
      restCoord: [],
    });

    this.filterRoad(this.state.roadSelection);
    this.onRoadDirFilter(e);
  }

  filterRoad(roadName) {
    const navermaps = window.naver.maps;
    let newData = [];
    let newData2 = [];
    for (var d of this.state.data) {
      if (roadName === '남해선') {
        if (d[1] === '남해선(영암순천)') {
          newData.push(new navermaps.LatLng(d[3], d[4]));
        } else if (d[1] === '남해선(순천부산)') {
          newData2.push(new navermaps.LatLng(d[3], d[4]));
        }
      } else if (roadName === '중앙선') {
        if (d[1] === '중앙선(김해대구)') {
          newData.push(new navermaps.LatLng(d[3], d[4]));
        } else if (d[1] === '중앙선(대구춘천)') {
          newData2.push(new navermaps.LatLng(d[3], d[4]));
        }
      } else if (roadName === '당진영덕선') {
        if (d[1] === '당진대전선') {
          newData.push(new navermaps.LatLng(d[3], d[4]));
        } else if (d[1] === '청주상주선') {
          newData2.push(new navermaps.LatLng(d[3], d[4]));
        }
      } else {
        if (d[1] === roadName) {
          newData.push(new navermaps.LatLng(d[3], d[4]));
        }
      }
    }
    this.setState({
      newData: newData,
      newData2: newData2,
    });
  }

  onRoadDirFilter(e) {
    const highwayOptions = [
      { value: '경부선', start: '서울', end: '부산', dx: 1, dy: -1, weird: 1 },
      {
        value: '광주대구선',
        start: '광주',
        end: '대구',
        dx: 1,
        dy: 1,
        weird: 0,
      },
      {
        value: '남해선(영암순천)',
        start: '영암',
        end: '순천',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '남해선(순천부산)',
        start: '순천',
        end: '부산',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '남해제2지선',
        start: '김해',
        end: '부산',
        dx: 1,
        dy: -1,
        weird: 0,
      },
      { value: '당진대전선', start: '당진', end: '대전' },
      { value: '청주상주선', start: '청주', end: '상주' },
      { value: '동해선', start: '동해', end: '속초', dx: 1, dy: -1, weird: 0 },
      {
        value: '대구포항선',
        start: '대구',
        end: '포항',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '서울양양선',
        start: '서울',
        end: '양양',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '서천공주선',
        start: '서천',
        end: '공주',
        dx: 1,
        dy: 1,
        weird: 0,
      },
      {
        value: '순천완주선',
        start: '순천',
        end: '완주',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      { value: '영동선', start: '인천', end: '강릉', dx: 1, dy: 1, weird: 1 },
      {
        value: '익산장수선',
        start: '익산',
        end: '장수',
        dx: 1,
        dy: -1,
        weird: 1,
      },
      {
        value: '중부내륙선',
        start: '창원',
        end: '양평',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      {
        value: '중부내륙선의 지선',
        start: '현풍',
        end: '대구',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '중앙선(김해대구)',
        start: '부산',
        end: '춘천',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      {
        value: '중앙선(대구춘천)',
        start: '부산',
        end: '춘천',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      {
        value: '통영대전선/중부선',
        start: '통영',
        end: '하남',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      {
        value: '평택제천선',
        start: '평택',
        end: '제천',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      { value: '호남선', start: '순천', end: '논산', dx: -1, dy: 1, weird: 1 },
      {
        value: '호남선의 지선',
        start: '논산',
        end: '대전',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '무안광주선',
        start: '무안',
        end: '광주',
        dx: 1,
        dy: 1,
        weird: 0,
      },
      { value: '부산포항선', start: '부산', end: '포항' },
      { value: '서해안선', start: '서울', end: '목포' },
      { value: '수도권제1순환선', start: '제천', end: '퇴계원' },

      // 합쳐서
      { value: '남해선', start: '순천', end: '부산', dx: 1, dy: 1, weird: 1 },
      { value: '중앙선', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },
      { value: '당진영덕선', start: '당진', end: '영덕' },
    ];

    for (var road of highwayOptions) {
      if (road.value === e) {
        this.setState({
          roadDir: [road.start, road.end],
        });
        return;
      }
    }
  }

  // 선택한 도로상에 위치한 휴게소 정보 요청
  async getServiceData() {
    try {
      const response = await Axios.get(
        'https://k3d202.p.ssafy.io/api/auth/rest/',
      );
      let restData = [];
      for (var rest of response.data) {
        if (
          rest.rest_high === this.state.roadSelection &&
          rest.rest_highdirect.includes(this.state.myDir)
        ) {
          var restObj = {
            restName: rest.rest_name,
            restAddress: rest.rest_address,
            restTel: rest.rest_tel,
            restDir: rest.rest_highdirect,
            restLat: Number(
              rest.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
            ),
            restLng: Number(
              rest.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
            ),
          };
          restData.push(restObj);
        }
      }
      this.setState({
        restData: restData,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const navermaps = window.naver.maps;
    // 고속도로 데이터(start: 기점, end: 종점, dx/dy: x/y축 진행 방향(대략, 기점->종점 기준), weird: 진행 방향 불규칙 여부)
    const highwayOptions = [
      { value: '경부선', start: '서울', end: '부산', dx: 1, dy: -1, weird: 1 },
      {
        value: '광주대구선',
        start: '광주',
        end: '대구',
        dx: 1,
        dy: 1,
        weird: 0,
      },

      // { value: '남해선(영암순천)', start: '영암', end: '순천', dx: 1, dy: 1, weird: 1 },
      // { value: '남해선(순천부산)', start: '순천', end: '부산', dx: 1, dy: 1, weird: 1 },
      { value: '남해선', start: '순천', end: '부산', dx: 1, dy: 1, weird: 1 },

      {
        value: '남해제2지선',
        start: '김해',
        end: '부산',
        dx: 1,
        dy: -1,
        weird: 0,
      },

      // { value: '당진대전선', start: '당진', end: '대전' },
      // { value: '청주상주선', start: '청주', end: '상주' },
      { value: '당진영덕선', start: '당진', end: '영덕' },

      { value: '동해선', start: '동해', end: '속초', dx: 1, dy: -1, weird: 0 },
      {
        value: '대구포항선',
        start: '대구',
        end: '포항',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '서울양양선',
        start: '서울',
        end: '양양',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '서천공주선',
        start: '서천',
        end: '공주',
        dx: 1,
        dy: 1,
        weird: 0,
      },
      {
        value: '순천완주선',
        start: '순천',
        end: '완주',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      { value: '영동선', start: '인천', end: '강릉', dx: 1, dy: 1, weird: 1 },
      {
        value: '익산장수선',
        start: '익산',
        end: '장수',
        dx: 1,
        dy: -1,
        weird: 1,
      },
      {
        value: '중부내륙선',
        start: '창원',
        end: '양평',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      {
        value: '중부내륙선의 지선',
        start: '현풍',
        end: '대구',
        dx: 1,
        dy: 1,
        weird: 1,
      },

      // { value: '중앙선(김해대구)', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },
      // { value: '중앙선(대구춘천)', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },
      { value: '중앙선', start: '김해', end: '춘천', dx: -1, dy: 1, weird: 1 },

      {
        value: '통영대전선/중부선',
        start: '통영',
        end: '하남',
        dx: -1,
        dy: 1,
        weird: 1,
      },
      {
        value: '평택제천선',
        start: '평택',
        end: '제천',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      { value: '호남선', start: '순천', end: '논산', dx: -1, dy: 1, weird: 1 },
      {
        value: '호남선의 지선',
        start: '논산',
        end: '대전',
        dx: 1,
        dy: 1,
        weird: 1,
      },
      {
        value: '무안광주선',
        start: '무안',
        end: '광주',
        dx: 1,
        dy: 1,
        weird: 0,
      },
      { value: '부산포항선', start: '부산', end: '포항' },
      { value: '서해안선', start: '서울', end: '목포' },
      { value: '수도권제1순환선', start: '제천', end: '퇴계원' },
    ];

    // 휴게소 마커
    const markers = this.state.restData.map((item, id) => (
      <Marker
        clickable={true}
        key={id}
        position={
          new navermaps.LatLng(Number(item.restLat), Number(item.restLng))
        }
        title={item.restName}
        onClick={(e) => {
          this.setState({
            restDrawerInfo: {
              restName: item.restName,
              restAddress: item.restAddress,
              restTel: item.restTel,
            },
          });
          this.mapRef.setZoom(7);
          this.mapRef.setCenter(new navermaps.LatLng(Number(item.restLat)-1.0, Number(item.restLng)));
          this.showDrawer();
        }}
      ></Marker>
    ));

    return (
      <>
        <div className="homebox my-5 w-100">
          <div className="w-100 mx-0">
            <div className="choice-highway-header">
              <div>
                <Link to="/" style={{ height: '100%' }}>
                  <i
                    className="text-black-50 fas fa-chevron-left"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                </Link>
              </div>
              <div className="highway-title">고속도로 선택</div>
            </div>
            <div className="choice-highway-box my-3">
              <div className="choicehighway">
                <div className="highway-input">
                  <Select
                    showSearch
                    options={highwayOptions}
                    style={{ width: '100%' }}
                    size={'large'}
                    placeholder="고속도로를 선택해주세요."
                    optionFilterProp="value"
                    onChange={(e) => {
                      this.onRoadFilter(e);
                    }}
                    filterOption={(input, option) =>
                      option.value.indexOf(input) >= 0
                    }
                  />

                  <Drawer
                    title={this.state.restDrawerInfo.restName + ' 휴게소'}
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
                      {this.state.restDrawerInfo.restAddress}
                    </div>
                    <div className="drawertel">
                      <i className="fas fa-phone-alt"></i>&nbsp;&nbsp;
                      {this.state.restDrawerInfo.restTel}
                    </div>
                    <Link to={`Detail/${this.state.restDrawerInfo.restName}`}>
                      <div className="drawerdetail">자세히 보기</div>
                    </Link>
                  </Drawer>
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
                ) : (
                  <>
                    <button
                      className="btn btn-outline-info mylocation-btn"
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
                )}
              </div>
            </div>
            <div className="btn-group mb-3 choice-direction">
              {this.state.roadSelection ? (
                <>
                  {this.state.myDir === this.state.roadDir[0] ? (
                    <>
                      <button
                        className="py-1 btn btn-info chocie-direction-btn"
                        onClick={(e) => {
                          this.setState({
                            myDir: this.state.roadDir[0],
                          });
                          this.getServiceData();
                        }}
                      >
                        {this.state.roadDir[0]} 방향
                      </button>
                      <button
                        className="py-1 btn btn-outline-info chocie-direction-btn"
                        onClick={(e) => {
                          this.setState({
                            myDir: this.state.roadDir[1],
                          });
                          this.getServiceData();
                        }}
                      >
                        {this.state.roadDir[1]} 방향
                      </button>
                    </>
                  ) : this.state.myDir === this.state.roadDir[1] ? (
                    <>
                      <button
                        className="py-1 btn btn-outline-info chocie-direction-btn"
                        onClick={(e) => {
                          this.setState({
                            myDir: this.state.roadDir[0],
                          });
                          this.getServiceData();
                        }}
                      >
                        {this.state.roadDir[0]} 방향
                      </button>
                      <button
                        className="py-1 btn btn-info chocie-direction-btn"
                        onClick={(e) => {
                          this.setState({
                            myDir: this.state.roadDir[1],
                          });
                          this.getServiceData();
                        }}
                      >
                        {this.state.roadDir[1]} 방향
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="py-1 btn btn-outline-info chocie-direction-btn"
                        onClick={(e) => {
                          this.setState({
                            myDir: this.state.roadDir[0],
                          });
                          this.getServiceData();
                        }}
                      >
                        {this.state.roadDir[0]} 방향
                      </button>
                      <button
                        className="py-1 btn btn-outline-info chocie-direction-btn"
                        onClick={(e) => {
                          this.setState({
                            myDir: this.state.roadDir[1],
                          });
                          this.getServiceData();
                        }}
                      >
                        {this.state.roadDir[1]} 방향
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    disabled
                    className="py-1 btn btn-outline-info chocie-direction-btn"
                  >
                    {this.state.roadDir[0]} 방향
                  </button>
                  <button
                    disabled
                    className="py-1 btn btn-outline-info chocie-direction-btn"
                  >
                    {this.state.roadDir[1]} 방향
                  </button>
                </>
              )}
            </div>

            <div className="mapDiv d-flex text-center">
              <NaverMap
                mapDivId={'react-naver-map'}
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

                {/* 도로 표시 폴리선 */}
                {this.state.newData.length > 0 ? (
                  <>
                    <Polyline
                      path={this.state.newData}
                      strokeColor={'#f4511e'}
                      strokeStyle={'solid'}
                      strokeOpacity={0.8}
                      strokeWeight={4}
                    />
                  </>
                ) : (
                  <></>
                )}
                {/* 도로 표시 폴리선 */}
                {this.state.newData2.length > 0 ? (
                  <>
                    <Polyline
                      path={this.state.newData2}
                      strokeColor={'#f4511e'}
                      strokeStyle={'solid'}
                      strokeOpacity={0.8}
                      strokeWeight={4}
                    />
                  </>
                ) : (
                  <></>
                )}

                {markers}
              </NaverMap>
            </div>

            <div className="footerDiv my-3"></div>
          </div>
        </div>
      </>
    );
  }
}

export default HighwayInfo;
