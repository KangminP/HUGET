import React, { Component } from 'react';

// react-router-dom
import { Link } from 'react-router-dom';

// Axios
import Axios from 'axios';

// Antd
import { Input, Select } from 'antd';

// CSS
import './SearchMenu.css';

class SearchMenu extends Component {
  constructor() {
    super();
    this.state = {
      menuInput: '',
      highInput: '',
      menuKeyword: '',
      menuData: [],
      // imgData: [],

      highKeyword: '',
      roadDir: ['상행', '하행'],
      dirKeyword: '',

      loading: false,
    };
    this.onMenuSearch = this.onMenuSearch.bind(this)
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onRoadSelect(e) {
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

    this.setState({
      highKeyword: e,
    });

    for (var road of highwayOptions) {
      if (road.value === e) {
        this.setState({
          roadDir: [road.start, road.end],
        });
        return;
      }
    }
  }

  async onMenuSearch() {
    this.setState({
      loading: true,
    });
    // 고속도로 입력했을때
    if (this.state.highKeyword) {
      let searchData = new FormData();
      searchData.append('rest_menu', this.state.menuKeyword);
      searchData.append('highway', this.state.highKeyword);
      try {
        const response = await Axios.post(
          'https://k3d202.p.ssafy.io/api/auth/search/foodhigh/',
          searchData,
        );
        let highList = [];
        // 방향 입력했을때
        if (this.state.dirKeyword) {
          for (var menu1 of response.data) {
            if (menu1.rest_high === this.state.highKeyword && menu1.rest_highdirect === this.state.dirKeyword) {
              highList.push(menu1)
            }
          }
        // 방향 입력 안했을때
        } else {
          for (var menu2 of response.data) {
            if (menu2.rest_high === this.state.highKeyword) {
              highList.push(menu2)
            }
          }
        }

        // // 결과에 대한 이미지 찾아넣기
        // let imgList = []
        // const that = this
        // for (var menu3 of highList) {
        //   // 이미지 검색하는 함수
        //   async function menuImageSearch(menuName) {
        //     try {
        //       const res = await Axios.get(`https://dapi.kakao.com/v2/search/image?sort=accuracy&query=${menuName}&page=1&size=1`, {
        //         headers: {
        //           Authorization: "KakaoAK fb6be54dc2cc041778b00cdef4fc7562"
        //         }
        //       })
        //       if (res.data.documents) {
        //         imgList.push(res.data.documents[0].image_url)
        //       } else {
        //         imgList.push("")
        //       }
        //       that.setState({
        //         imgData: imgList,
        //       })
        //     } catch (err) {
        //       console.log(err)
        //     }
        //     console.log(imgList)
        //   }
        //   // 실행
        //   menuImageSearch(menu3.menu_name)
        // }

        this.setState({
          menuData: highList,
          
          loading: false,
        })


      } catch (err) {
        console.log(err)
      }
    // 메뉴만 입력했을때
    } else {
      let searchData = new FormData();
      searchData.append('rest_menu', this.state.menuKeyword);
      try {
        const response = await Axios.post(
          'https://k3d202.p.ssafy.io/api/auth/search/food/',
          searchData,
        );
        this.setState({
          menuData: response.data,
          loading: false,
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    // 고속도로 목록
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

    // 검색 결과 카드 mapping
    const menus = this.state.menuData.map((menu, index) => (
      <div key={index} className="col-xs-12 col-sm-6 w-100 p-0">
        <div key={index} className="box effect mx-3 ">
          {/* <p className="text-center">휴게소: {menu[0].rest_name}</p> */}
          <div className="d-flex justify-content-around px-2 text-center-direction">
            <p className="text-center">
              <i className="fas fa-road"></i>
              &nbsp;&nbsp;{menu.rest_high}
            </p>
            <p className="text-center">
              <i className="fas fa-directions"></i>
              &nbsp;&nbsp;{menu.rest_highdirect} 방향
            </p>
          </div>
          
          <hr className="mt-0" />
          {/* <img src={this.state.imgData[index]} alt="menu_img"/> */}
          <p className="text-center text-center-info-name">
            {menu.menu_name}
          </p>
          <p className="text-center text-center-info-content">
            {menu.menu_price}원
          </p>
          <div className="text-center text-center-info-content">
            {menu.menu_best === 'Y' ? (
              <p className="text-center-best">베스트로 선정된 메뉴입니다 !</p>
            ) : (
              <p>맛있게 드세요 !</p>
            )}
          </div>
          <hr />

          <div className="cardFooter">
            <Link to={`/Detail/${menu.rest_name}`}>
              <button className="w-100 btn search-menu-godetail-btn">
                {menu.rest_name} 휴게소
              </button>
            </Link>
          </div>
        </div>
      </div>
    ));

    return (
      <>
        <div className="rootbox">
          <div className="detailbox searchbox my-5">
            <div className="search-menu-header">
              <div>
                <Link to="/" style={{ height: '100%' }}>
                  <i
                    className="text-black-50 fas fa-chevron-left"
                    style={{ fontSize: '1.8rem' }}
                  ></i>
                </Link>
              </div>
              <div className="search-menu-title">먹거리 검색</div>
            </div>
            <div className="blankdiv"></div>
            <div className="search-menu-box mx-3 pt-3 d-flex justify-content-between">
              <div className="form-group box effect w-100">
                <Input
                  placeholder="찾으실 메뉴를 검색해주세요."
                  type="text"
                  onChange={(e) => {
                    this.setState({
                      menuKeyword: e.target.value,
                    });
                  }}
                  onKeyPress={(e) => {
                    if (
                      e.key === 'Enter' &&
                      this.state.menuKeyword
                    ) {
                      this.onMenuSearch();
                    }
                  }}
                ></Input>

                <Select
                  options={highwayOptions}
                  style={{ width: '100%' }}
                  placeholder="고속도로 선택"
                  onChange={(e) => {
                    this.onRoadSelect(e);
                  }}
                />

                {/* 방향 선택 */}
                {this.state.highKeyword ? (
                  <>
                    {this.state.dirKeyword === this.state.roadDir[0] ? (
                      <div className="select-direction-btn-box choice-section">
                        <button
                          className="py-1 btn btn-info chocie-direction-btn"
                          onClick={(e) => {
                            this.setState({
                              dirKeyword: this.state.roadDir[0],
                            });
                          }}
                        >
                          {this.state.roadDir[0]} 방향
                        </button>
                        <button
                          className="py-1 btn btn-outline-info chocie-direction-btn"
                          onClick={(e) => {
                            this.setState({
                              dirKeyword: this.state.roadDir[1],
                            });
                          }}
                        >
                          {this.state.roadDir[1]} 방향
                        </button>
                      </div>
                    ) : this.state.dirKeyword === this.state.roadDir[1] ? (
                      <div className="select-direction-btn-box choice-section">
                        <button
                          className="py-1 btn btn-outline-info chocie-direction-btn"
                          onClick={(e) => {
                            this.setState({
                              dirKeyword: this.state.roadDir[0],
                            });
                          }}
                        >
                          {this.state.roadDir[0]} 방향
                        </button>
                        <button
                          className="py-1 btn btn-info chocie-direction-btn"
                          onClick={(e) => {
                            this.setState({
                              dirKeyword: this.state.roadDir[1],
                            });
                          }}
                        >
                          {this.state.roadDir[1]} 방향
                        </button>
                      </div>
                    ) : (
                      <div className="select-direction-btn-box choice-section">
                        <button
                          className="py-1 btn btn-outline-info chocie-direction-btn"
                          onClick={(e) => {
                            this.setState({
                              dirKeyword: this.state.roadDir[0],
                            });
                          }}
                        >
                          {this.state.roadDir[0]} 방향
                        </button>
                        <button
                          className="py-1 btn btn-outline-info chocie-direction-btn"
                          onClick={(e) => {
                            this.setState({
                              dirKeyword: this.state.roadDir[1],
                            });
                          }}
                        >
                          {this.state.roadDir[1]} 방향
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="select-direction-btn-box choice-section">
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
                  </div>
                )}

                {this.state.menuKeyword ? (
                  <div className="select-direction-btn-box serach-push">
                    <button
                      type="submit"
                      className="w-100 btn search-push-btn"
                      onClick={(e) => {
                        this.onMenuSearch();
                      }}
                    >
                      검색
                    </button>
                  </div>
                ) : (
                  <div className="select-direction-btn-box serach-push">
                    <button
                      disabled
                      type="submit"
                      className="w-100 btn disabled search-push-btn-not"
                    >
                      입력 후 버튼이 활성화됩니다.
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className=" d-flex justify-content-center">
              {this.state.loading ? (
                <>
                  <div className="box effect mx-3 text-center">
                    <p className="mb-0 loading-text">
                      <i className="fa fa-spinner fa-spin fa-fw"></i>
                      &nbsp;&nbsp;검색결과 불러오는 중...</p>
                  </div>
                </>
              ) : (
                <div className="row d-flex justify-content-center align-items-center w-100">
                  {menus}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SearchMenu;
