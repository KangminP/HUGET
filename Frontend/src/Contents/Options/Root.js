import React, { Component } from 'react';

// router-dom
import { Link } from 'react-router-dom';

// Naver Map
import { NaverMap, Marker, Polyline } from 'react-naver-maps';

// Axios
import axios from 'axios';

// Ant Design
import { Input, Drawer, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

// css
import './Root.css';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      // 좌표 관련
      currentLat: '',
      currentLng: '',
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      path: [],
      showMyPosition: false,
      leftX: 0,
      rightX: 0,
      topY: 0,
      bottomY: 0,

      // 도로 데이터 관련
      data: [],
      newData: [],
      searchOption: 0,

      // 주소-좌표 변환 요청
      startAddress: '',
      startSido: '',
      startGugun: '',
      startDong: '',
      startFlag: '',
      startDetailAddress: '',
      startBunji: '',
      endAddress: '',
      endSido: '',
      endGugun: '',
      endDong: '',
      endFlag: '',
      endDetailAddress: '',
      endBunji: '',

      loading: false,

      // 경로에서 지나는 고속도로
      pastRoad: '',
      currentRoad: '',

      // 휴게소 데이터
      allRestData: [], // 전체 휴게소 목록
      restData: [], // 마커 클릭 시 보여줄 휴게소 데이터
      selectedRests: [], // 경로 구간에 속한 휴게소 목록

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

    // functions binding
    // naver map 설정
    this.toggleInteraction = this.toggleInteraction.bind(this);
    this.toggleControl = this.toggleControl.bind(this);
    // Drawer
    this.showDrawer = this.showDrawer.bind(this);
    this.onDrawerClose = this.onDrawerClose.bind(this);
    // 경로 및 휴게소 탐색 함수
    this.callTmap = this.callTmap.bind(this);
    this.getServiceData = this.getServiceData.bind(this);
    // 주소 및 좌표 입력 함수
    this.onDaumPostStart = this.onDaumPostStart.bind(this);
    this.onDaumPostEnd = this.onDaumPostEnd.bind(this);
    this.getStartCoordinate = this.getStartCoordinate.bind(this);
    this.getEndCoordinate = this.getEndCoordinate.bind(this);
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
    // 휴게소 데이터 저장
    this.getServiceData();
  }

  // 휴게소 정보 요청
  async getServiceData() {
    try {
      const response = await axios.get(
        'https://k3d202.p.ssafy.io/api/auth/rest/',
      );
      this.setState({
        allRestData: response.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  // 출발지 ~ 도착지 경로 탐색 요청 보내는 함수
  async callTmap() {
    const navermaps = window.naver.maps;
    // 지도 재정렬
    this.mapRef.setZoom(7);
    this.mapRef.setCenter(new navermaps.LatLng(36.3504119, 127.8845475));
    this.setState({
      loading: true,
    });

    const data = {
      startX: Number(this.state.startX),
      startY: Number(this.state.startY),
      endX: Number(this.state.endX),
      endY: Number(this.state.endY),
      searchOption: this.state.searchOption,
      // "roadType": 1,
    };
    try {
      const response = await axios.post(
        'https://apis.openapi.sk.com/tmap/routes?version=1&callback=result',
        data,
        {
          headers: {
            appKey: 'l7xxa4ca1e56f9614f3bbbf05f44db1fe38d',
          },
        },
      );

      // 휴게소 검색할 범위 설정 좌표 초기화
      this.setState({
        leftX: this.state.startX,
        rightX: this.state.startX,
        topY: this.state.startY,
        bottomY: this.state.startY,
      });

      let hwPts = [];
      let hwLine = [];
      let hwJcs = []; // 고속도로 진입 또는 고속도로 바뀌는 지점
      let hws = []; // 이용하는 고속도로 담는 배열
      let selectedRests = []; // 범위안에 있는 휴게소 담는 배열
      for (var m of response.data.features) {
        // 경로가 지나는 고속도로 목록 수집
        if (
          (m.properties.nextRoadName &&
            m.properties.nextRoadName.includes('고속도로')) ||
          (m.properties.name && m.properties.name.includes('고속도로'))
        ) {
          if (m.geometry.type === 'Point') {
            hwPts.push({
              nextHighway: m.properties.nextRoadName.split(', ')[0],
              coordinates: m.geometry.coordinates,
            });
          } else {
            for (var cds of m.geometry.coordinates) {
              hwLine.push({
                highway: m.properties.name.replace(' 고속도로', '선'),
                coordinates: cds,
              });
              if (!hws.includes(m.properties.name.replace(' 고속도로', '선'))) {
                hws.push(m.properties.name.replace(' 고속도로', '선'));
              }
            }
          }
        }
        if (m.properties.roadName && m.properties.name.includes('고속도로')) {
          this.setState({
            currentRoad: m.properties.roadName.replace(' 고속도로', '선'),
          });
        }
        // !!!!--- 경로 쪼개서 휴게소 검색 ---!!!!
        // 1. 일반도로->고속도로 또는 고속도로->고속도로 바뀌는 지점
        if (
          m.properties.turnType === 101 ||
          m.properties.turnType === 102 ||
          m.properties.turnType === 103 ||
          m.properties.turnType === 111 ||
          m.properties.turnType === 112 ||
          m.properties.turnType === 113 ||
          (m.properties.nextRoadName &&
            m.properties.nextRoadName.includes('고속도로'))
        ) {
          if (
            m.properties.nextRoadName.replace(' 고속도로', '선') !==
            this.state.currentRoad
          ) {
            if (!hwJcs.includes(m.properties.name)) {
              // 지점 정보
              hwJcs.push([m.properties.name, m.geometry.coordinates]);
              // 휴게소 탐색할 사각영역 지정
              if (m.geometry.coordinates[0] < this.state.leftX) {
                this.setState({
                  rightX: this.state.leftX,
                });
                this.setState({
                  leftX: m.geometry.coordinates[0],
                });
              } else if (m.geometry.coordinates[0] > this.state.rightX) {
                this.setState({
                  leftX: this.state.rightX,
                });
                this.setState({
                  rightX: m.geometry.coordinates[0],
                });
              }
              if (m.geometry.coordinates[1] < this.state.bottomY) {
                this.setState({
                  topY: this.state.bottomY,
                });
                this.setState({
                  bottomY: m.geometry.coordinates[1],
                });
              } else if (m.geometry.coordinates[1] > this.state.topY) {
                this.setState({
                  bottomY: this.state.topY,
                });
                this.setState({
                  topY: m.geometry.coordinates[1],
                });
              }
              // 다음 구간 고속도로 설정
              this.setState({
                pastRoad: this.state.currentRoad,
              });
              this.setState({
                currentRoad: m.properties.nextRoadName.replace(
                  ' 고속도로',
                  '선',
                ),
              });
              // 좌표 조건을 만족하면서 해당 고속도로에 소속된 휴게소 리스트
              for (var rest of this.state.allRestData) {
                if (
                  rest.rest_tmap.includes(this.state.pastRoad) &&
                  // if (rest.rest_high === this.state.pastRoad &&
                  Number(
                    rest.rest_coordinate
                      .slice(1, -1)
                      .split(',')[1]
                      .slice(2, -1),
                  ) > this.state.bottomY &&
                  Number(
                    rest.rest_coordinate
                      .slice(1, -1)
                      .split(',')[1]
                      .slice(2, -1),
                  ) < this.state.topY &&
                  Number(
                    rest.rest_coordinate
                      .slice(1, -1)
                      .split(',')[0]
                      .slice(1, -1),
                  ) > this.state.leftX &&
                  Number(
                    rest.rest_coordinate
                      .slice(1, -1)
                      .split(',')[0]
                      .slice(1, -1),
                  ) < this.state.rightX
                ) {
                  var restObj = {
                    restName: rest.rest_name,
                    restAddress: rest.rest_address,
                    restTel: rest.rest_tel,
                    restDir: rest.rest_highdirect,
                    restLat: Number(
                      rest.rest_coordinate
                        .slice(1, -1)
                        .split(',')[1]
                        .slice(2, -1),
                    ),
                    restLng: Number(
                      rest.rest_coordinate
                        .slice(1, -1)
                        .split(',')[0]
                        .slice(1, -1),
                    ),
                  };
                  selectedRests.push(restObj);
                }
              }
            }
          }
        } else if (
          // 2. 고속도로 출구
          m.properties.turnType === 104 ||
          m.properties.turnType === 105 ||
          m.properties.turnType === 106 ||
          m.properties.turnType === 114 ||
          m.properties.turnType === 115 ||
          m.properties.turnType === 116
        ) {
          // 휴게소 탐색할 사각영역 지정
          if (m.geometry.coordinates[0] < this.state.leftX) {
            this.setState({
              rightX: this.state.leftX,
            });
            this.setState({
              leftX: m.geometry.coordinates[0],
            });
          } else if (m.geometry.coordinates[0] > this.state.rightX) {
            this.setState({
              leftX: this.state.rightX,
            });
            this.setState({
              rightX: m.geometry.coordinates[0],
            });
          }
          if (m.geometry.coordinates[1] < this.state.bottomY) {
            this.setState({
              topY: this.state.bottomY,
            });
            this.setState({
              bottomY: m.geometry.coordinates[1],
            });
          } else if (m.geometry.coordinates[1] > this.state.topY) {
            this.setState({
              bottomY: this.state.topY,
            });
            this.setState({
              topY: m.geometry.coordinates[1],
            });
          }
          this.setState({
            pastRoad: this.state.currentRoad,
          });
          // 좌표 조건을 만족하면서 해당 고속도로에 소속된 휴게소 리스트
          for (var rest1 of this.state.allRestData) {
            if (
              rest1.rest_tmap.includes(this.state.pastRoad) &&
              Number(
                rest1.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) > this.state.bottomY &&
              Number(
                rest1.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) < this.state.topY &&
              Number(
                rest1.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) > this.state.leftX &&
              Number(
                rest1.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) < this.state.rightX
            ) {
              var restObj1 = {
                restName: rest1.rest_name,
                restAddress: rest1.rest_address,
                restTel: rest1.rest_tel,
                restDir: rest1.rest_highdirect,
                restLat: Number(
                  rest1.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
                ),
                restLng: Number(
                  rest1.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
                ),
              };
              selectedRests.push(restObj1);
            }
          }
          // 3. IC 등 기타 분기점 {
        } else if (
          m.properties.name &&
          m.properties.name.includes('IC') &&
          m.properties.name.includes('JC')
        ) {
          // 휴게소 탐색할 사각영역 지정
          if (m.geometry.coordinates[0] < this.state.leftX) {
            this.setState({
              rightX: this.state.leftX,
            });
            this.setState({
              leftX: m.geometry.coordinates[0],
            });
          } else if (m.geometry.coordinates[0] > this.state.rightX) {
            this.setState({
              leftX: this.state.rightX,
            });
            this.setState({
              rightX: m.geometry.coordinates[0],
            });
          }
          if (m.geometry.coordinates[1] < this.state.bottomY) {
            this.setState({
              topY: this.state.bottomY,
            });
            this.setState({
              bottomY: m.geometry.coordinates[1],
            });
          } else if (m.geometry.coordinates[1] > this.state.topY) {
            this.setState({
              bottomY: this.state.topY,
            });
            this.setState({
              topY: m.geometry.coordinates[1],
            });
          }
          this.setState({
            pastRoad: this.state.currentRoad,
          });
          // 좌표 조건을 만족하면서 해당 고속도로에 소속된 휴게소 리스트
          for (var rest2 of this.state.allRestData) {
            if (
              rest2.rest_tmap.includes(this.state.pastRoad) &&
              Number(
                rest2.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) > this.state.bottomY &&
              Number(
                rest2.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) < this.state.topY &&
              Number(
                rest2.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) > this.state.leftX &&
              Number(
                rest2.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) < this.state.rightX
            ) {
              var restObj2 = {
                restName: rest2.rest_name,
                restAddress: rest2.rest_address,
                restTel: rest2.rest_tel,
                restDir: rest2.rest_highdirect,
                restLat: Number(
                  rest2.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
                ),
                restLng: Number(
                  rest2.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
                ),
              };
              selectedRests.push(restObj2);
            }
          }
        } else if (
          // 4. 도착지
          m.properties.turnType === 201
        ) {
          // 휴게소 탐색할 사각영역 지정
          if (m.geometry.coordinates[0] < this.state.leftX) {
            this.setState({
              rightX: this.state.leftX,
            });
            this.setState({
              leftX: m.geometry.coordinates[0],
            });
          } else if (m.geometry.coordinates[0] > this.state.rightX) {
            this.setState({
              leftX: this.state.rightX,
            });
            this.setState({
              rightX: m.geometry.coordinates[0],
            });
          }
          if (m.geometry.coordinates[1] < this.state.bottomY) {
            this.setState({
              topY: this.state.bottomY,
            });
            this.setState({
              bottomY: m.geometry.coordinates[1],
            });
          } else if (m.geometry.coordinates[1] > this.state.topY) {
            this.setState({
              bottomY: this.state.topY,
            });
            this.setState({
              topY: m.geometry.coordinates[1],
            });
          }
          this.setState({
            pastRoad: this.state.currentRoad,
          });
          // 좌표 조건을 만족하면서 해당 고속도로에 소속된 휴게소 리스트
          for (var rest3 of this.state.allRestData) {
            if (
              rest3.rest_tmap.includes(this.state.pastRoad) &&
              Number(
                rest3.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) > this.state.bottomY &&
              Number(
                rest3.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) < this.state.topY &&
              Number(
                rest3.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) > this.state.leftX &&
              Number(
                rest3.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) < this.state.rightX
            ) {
              var restObj3 = {
                restName: rest3.rest_name,
                restAddress: rest3.rest_address,
                restTel: rest3.rest_tel,
                restDir: rest3.rest_highdirect,
                restLat: Number(
                  rest3.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
                ),
                restLng: Number(
                  rest3.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
                ),
              };
              selectedRests.push(restObj3);
            }
          }
        } else if (
          // 5. 급커브
          m.properties.turnType === 193
        ) {
          // 휴게소 탐색할 사각영역 지정
          if (m.geometry.coordinates[0] < this.state.leftX) {
            this.setState({
              rightX: this.state.leftX,
            });
            this.setState({
              leftX: m.geometry.coordinates[0],
            });
          } else if (m.geometry.coordinates[0] > this.state.rightX) {
            this.setState({
              leftX: this.state.rightX,
            });
            this.setState({
              rightX: m.geometry.coordinates[0],
            });
          }
          if (m.geometry.coordinates[1] < this.state.bottomY) {
            this.setState({
              topY: this.state.bottomY,
            });
            this.setState({
              bottomY: m.geometry.coordinates[1],
            });
          } else if (m.geometry.coordinates[1] > this.state.topY) {
            this.setState({
              bottomY: this.state.topY,
            });
            this.setState({
              topY: m.geometry.coordinates[1],
            });
          }
          this.setState({
            pastRoad: this.state.currentRoad,
          });
          // 좌표 조건을 만족하면서 해당 고속도로에 소속된 휴게소 리스트
          for (var rest4 of this.state.allRestData) {
            if (
              rest4.rest_tmap.includes(this.state.pastRoad) &&
              Number(
                rest4.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) > this.state.bottomY &&
              Number(
                rest4.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
              ) < this.state.topY &&
              Number(
                rest4.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) > this.state.leftX &&
              Number(
                rest4.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
              ) < this.state.rightX
            ) {
              var restObj4 = {
                restName: rest4.rest_name,
                restAddress: rest4.rest_address,
                restTel: rest4.rest_tel,
                restDir: rest4.rest_highdirect,
                restLat: Number(
                  rest4.rest_coordinate.slice(1, -1).split(',')[1].slice(2, -1),
                ),
                restLng: Number(
                  rest4.rest_coordinate.slice(1, -1).split(',')[0].slice(1, -1),
                ),
              };
              selectedRests.push(restObj4);
            }
          }
        }
      }
      // 경로에 위치한 휴게소 목록 최종적으로 저장
      this.setState({
        selectedRests: selectedRests,
      });
      // console.log(hwJcs);
      // console.log(hws);

      // 응답 GeoJSON에서 위도, 경도 데이터 추출1: features에서 좌표 정보 들어있는 배열 추출
      let pathPoints = [];
      for (var i of response.data.features) {
        pathPoints.push(i.geometry.coordinates);
      }

      // 응답 GeoJSON에서 위도, 경도 데이터 추출2: 배열 길이가 불규칙적이기 때문에 하나의 좌표 쌍으로 구성된 배열들로 재정렬
      let polyPoints = [];
      for (var pts of pathPoints) {
        if (Array.isArray(pts) && pts.length === 2) {
          polyPoints.push(pts);
        } else if (
          Array.isArray(pts) &&
          Array.isArray(pts[0]) &&
          pts.length > 2
        ) {
          for (var pt of pts) {
            polyPoints.push(pt);
          }
        } else {
        }
      }
      let polyPointss = [];
      for (var pp of polyPoints) {
        if (Array.isArray(pp[0])) {
          for (var ppp of pp) {
            polyPointss.push(ppp);
          }
        } else {
          polyPointss.push(pp);
        }
      }

      // 응답 GeoJSON에서 위도, 경도 데이터 추출3: 네이버 지도의 점 요소로 변환(위도: y, 경도: x)
      let linePoints = [];
      for (var p of polyPointss) {
        var pointObject = new navermaps.LatLng(p[1], p[0]);
        if (linePoints.includes(pointObject) === false) {
          linePoints.push(pointObject);
        }
      }
      // State에 저장
      this.setState({
        path: linePoints,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  // 다음 도로명 주소 검색창 팝업
  onDaumPostStart() {
    const that = this;
    new window.daum.Postcode({
      oncomplete: function (data) {
        if (data.userSelectedType === 'R') {
          if (data.buildingName) {
            that.setState({
              startAddress: data.roadAddress,
              startSido: data.sido,
              startGugun: data.sigungu,
              startDong: data.roadname,
              startFlag: 'F02',
              startDetailAddress: data.buildingName,
            });
          } else {
            that.setState({
              startAddress: data.roadAddress,
              startSido: data.sido,
              startGugun: data.sigungu,
              startDong: data.roadname,
              startFlag: 'F02',
              startDetailAddress: data.roadAddressEnglish.split(',')[0],
            });
          }
        } else if (data.userSelectedType === 'J') {
          that.setState({
            startAddress: data.jibunAddress,
            startSido: data.sido,
            startGugun: data.sigungu,
            startDong: data.bname,
            startFlag: 'F01',
            startBunji: data.jibunAddressEnglish.split(',')[0],
          });
        } else {
        }
        that.getStartCoordinate();
      },
    }).open();
  }

  async getStartCoordinate() {
    const rQuery = {
      city_do: this.state.startSido,
      gu_gun: this.state.startGugun,
      dong: this.state.startDong,
      addressFlag: this.state.startFlag,
      bunji: this.state.startBunji,
      detailAddress: this.state.startDetailAddress,
    };
    try {
      const response = await axios.get(
        `https://apis.openapi.sk.com/tmap/geo/geocoding?version=1&city_do=${rQuery.city_do}&gu_gun=${rQuery.gu_gun}&dong=${rQuery.dong}&bunji=${rQuery.bunji}&detailAddress=${rQuery.detailAddress}&addressFlag=${rQuery.addressFlag}&appKey=l7xxa4ca1e56f9614f3bbbf05f44db1fe38d`,
      );
      if (
        response.data.coordinateInfo.newLat &&
        response.data.coordinateInfo.newLon
      ) {
        this.setState({
          startX: response.data.coordinateInfo.newLon,
          startY: response.data.coordinateInfo.newLat,
        });
      } else {
        this.setState({
          startX: response.data.coordinateInfo.lon,
          startY: response.data.coordinateInfo.lat,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  onDaumPostEnd() {
    const that = this;
    new window.daum.Postcode({
      oncomplete: function (data) {
        if (data.userSelectedType === 'R') {
          if (data.buildingName) {
            that.setState({
              endAddress: data.roadAddress,
              endSido: data.sido,
              endGugun: data.sigungu,
              endDong: data.roadname,
              endFlag: 'F02',
              endDetailAddress: data.buildingName,
            });
          } else {
            that.setState({
              endAddress: data.roadAddress,
              endSido: data.sido,
              endGugun: data.sigungu,
              endDong: data.roadname,
              endFlag: 'F02',
              endDetailAddress: data.roadAddressEnglish.split(',')[0],
            });
          }
        } else if (data.userSelectedType === 'J') {
          that.setState({
            endAddress: data.jibunAddress,
            endSido: data.sido,
            endGugun: data.sigungu,
            endDong: data.bname,
            endFlag: 'F01',
            endBunji: data.jibunAddressEnglish.split(',')[0],
          });
        } else {
        }
        that.getEndCoordinate();
      },
    }).open();
  }

  async getEndCoordinate() {
    const rQuery = {
      city_do: this.state.endSido,
      gu_gun: this.state.endGugun,
      dong: this.state.endDong,
      addressFlag: this.state.endFlag,
      bunji: this.state.endBunji,
      detailAddress: this.state.endDetailAddress,
    };
    try {
      const response = await axios.get(
        `https://apis.openapi.sk.com/tmap/geo/geocoding?version=1&city_do=${rQuery.city_do}&gu_gun=${rQuery.gu_gun}&dong=${rQuery.dong}&bunji=${rQuery.bunji}&detailAddress=${rQuery.detailAddress}&addressFlag=${rQuery.addressFlag}&appKey=l7xxa4ca1e56f9614f3bbbf05f44db1fe38d`,
      );
      if (
        response.data.coordinateInfo.newLat &&
        response.data.coordinateInfo.newLon
      ) {
        this.setState({
          endX: response.data.coordinateInfo.newLon,
          endY: response.data.coordinateInfo.newLat,
        });
      } else {
        this.setState({
          endX: response.data.coordinateInfo.lon,
          endY: response.data.coordinateInfo.lat,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const navermaps = window.naver.maps;

    const searchOptions = [
      { key: 0, value: '교통최적' },
      { key: 2, value: '최소시간' },
      { key: 4, value: '고속도로 우선' },
    ];

    // 휴게소 마커
    const markers = this.state.selectedRests.map((item, id) => (
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
          this.mapRef.setCenter(new navermaps.LatLng(Number(item.restLat)-1.5, Number(item.restLng)));
          this.showDrawer();
        }}
      />
    ));

    return (
      <>
        <div className="homebox my-5 w-100">
          <div className="w-100 mx-0">
            <div className="recom-root-header">
              <div>
                <Link to="/" style={{ height: '100%' }}>
                  <i
                    className="text-black-50 fas fa-chevron-left"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                </Link>
              </div>
              <div className="root-title">고속도로 경로 탐색</div>
            </div>

            <div className="start-end-input my-3">
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
              <Input
                className="mb-3"
                placeholder="여기를 클릭하여 출발지를 선택해주세요."
                value={this.state.startAddress}
                onClick={(e) => {
                  this.onDaumPostStart();
                }}
              />
              <Input
                className="mb-3"
                placeholder="여기를 클릭하여 목적지를 선택해주세요."
                value={this.state.endAddress}
                onClick={(e) => {
                  this.onDaumPostEnd();
                }}
              />
              <div className="recom-root-box">
                {/* <div className="choiceroot">
                  <Select
                    className="mb-3"
                    options={searchOptions}
                    style={{ width: '100%' }}
                    placeholder="경로 탐색 기준을 선택해주세요."
                    onChange={(e) => {
                      if (e === '교통최적') {
                        this.setState({
                          searchOption: 0,
                        });
                      } else if (e === '최소시간') {
                        this.setState({
                          searchOption: 2,
                        });
                      } else {
                        this.setState({
                          searchOption: 4,
                        });
                      }
                    }}
                  />
                </div> */}
              </div>

              {this.state.startX &&
              this.state.startY &&
              this.state.endX &&
              this.state.endY ? (
                <>
                  <div className="recom-root-box">
                    {this.state.loading === false ? (
                      <>
                        <button
                          className="findButton w-100 btn btn-outline-danger"
                          onClick={this.callTmap}
                        >
                          경로 검색
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="findButton w-100 btn btn-outline-danger">
                          <Spin indicator={loadingIcon} />
                        </button>
                      </>
                    )}

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
                </>
              ) : (
                <>
                  <div className="recom-root-box">
                    <button
                      disabled
                      className="findButton disabled w-100 btn btn-outline-danger"
                    >
                      경로 검색
                    </button>

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
                </>
              )}
            </div>

            <div className="mapDiv d-flex text-center">
              <NaverMap
                mapDivId={'react-naver-map'}
                style={{
                  width: '100%',
                  height: '75vh',
                  padding: 0,
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

                {/* 출발점, 도착점 마커 */}
                {this.state.startX && this.state.startY ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(
                          Number(this.state.startY),
                          Number(this.state.startX),
                        )
                      }
                      icon={{
                        url:
                          'https://icons.iconarchive.com/icons/paomedia/small-n-flat/32/map-marker-icon.png',
                        size: new navermaps.Size(28, 37),
                        origin: new navermaps.Point(0, 0),
                        anchor: new navermaps.Point(12, 37),
                      }}
                      title="출발"
                    />
                  </>
                ) : (
                  <></>
                )}
                {this.state.endX && this.state.endY ? (
                  <>
                    <Marker
                      position={
                        new navermaps.LatLng(
                          Number(this.state.endY),
                          Number(this.state.endX),
                        )
                      }
                      icon={{
                        url:
                          'https://icons.iconarchive.com/icons/paomedia/small-n-flat/32/map-marker-icon.png',
                        size: new navermaps.Size(28, 37),
                        origin: new navermaps.Point(0, 0),
                        anchor: new navermaps.Point(12, 37),
                      }}
                      title="도착"
                    />
                  </>
                ) : (
                  <></>
                )}

                {markers}

                {/* 경로 표시 폴리선 */}
                {this.state.path.length > 0 ? (
                  <>
                    <Polyline
                      path={this.state.path}
                      // clickable // 사용자 인터랙션을 받기 위해 clickable을 true로 설정합니다.
                      strokeColor={'#F44336'}
                      strokeStyle={'solid'}
                      strokeOpacity={1}
                      strokeWeight={3}
                    />
                  </>
                ) : (
                  <></>
                )}
              </NaverMap>
            </div>

            <div className="footerDiv my-3"></div>
          </div>
        </div>
      </>
    );
  }
}

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default Root;
