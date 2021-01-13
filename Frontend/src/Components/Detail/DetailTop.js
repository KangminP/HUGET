import React, { Component } from 'react';

// antd
import { Alert } from 'antd';

// css
// import './DetailTop.css';
import './DetailTop.css';

// react-reveal
import Fade from 'react-reveal/Fade';

// axios
import Axios from 'axios';

class DetailTop extends Component {
  constructor() {
    super();
    this.state = {
      top_arr: [],

      top1: '',
      top2: '',
      top3: '',
      top4: '',
      top5: '',

      corner1: '',
      corner2: '',
      corner3: '',
      corner4: '',
      corner5: '',
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

      this.setState({
        top_arr: response.data.TOP,

        top1: response.data.TOP[0].top_item,
        top2: response.data.TOP[1].top_item,
        top3: response.data.TOP[2].top_item,
        top4: response.data.TOP[3].top_item,
        top5: response.data.TOP[4].top_item,

        corner1: response.data.TOP[0].top_shop,
        corner2: response.data.TOP[1].top_shop,
        corner3: response.data.TOP[2].top_shop,
        corner4: response.data.TOP[3].top_shop,
        corner5: response.data.TOP[4].top_shop,
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getRestInfo();
  }

  render() {
    const {
      top_arr,
      top1,
      top2,
      top3,
      top4,
      top5,
      corner1,
      corner2,
      corner3,
      corner4,
      corner5,
    } = this.state;

    return (
      <div className="box effect">
        <div className="ml-1 mb-1 detail-box-title">매출 Top 5</div>
        <div className="ml-1 mb-4 detail-box-subtitle">&gt;&gt; 이 휴게소에서 가장 매출이 높은 5가지 상품의 정보입니다.</div>

        {top_arr.length > 0 ? (
          <>
            <Fade bottom cascade>
              <Fade bottom>
                <div className="post highranking first">
                  <div className="flex">
                    <div className="rank">1</div>
                    <div className="post-content">
                      <div className="post-item category">{top1}</div>
                    </div>
                  </div>
                  <div className="corner">{corner1}</div>
                </div>
              </Fade>

              <Fade bottom>
                <div className="post highranking second">
                  <div className="flex">
                    <div className="rank">2</div>
                    <div className="post-content">
                      <div className="post-item category">{top2}</div>
                    </div>
                  </div>
                  <div className="corner">{corner2}</div>
                </div>
              </Fade>

              <Fade bottom>
                <div className="post highranking third">
                  <div className="flex">
                    <div className="rank">3</div>
                    <div className="post-content">
                      <div className="post-item category">{top3}</div>
                    </div>
                  </div>
                  <div className="corner">{corner3}</div>
                </div>
              </Fade>

              <Fade bottom>
                <div className="post lowranking">
                  <div className="flex">
                    <div className="rank">4</div>
                    <div className="post-content">
                      <div className="post-item category">{top4}</div>
                    </div>
                  </div>
                  <div className="corner">{corner4}</div>
                </div>
              </Fade>

              <Fade bottom>
                <div className="post lowranking">
                  <div className="flex">
                    <div className="rank">5</div>
                    <div className="post-content">
                      <div className="post-item category">{top5}</div>
                    </div>
                  </div>
                  <div className="corner">{corner5}</div>
                </div>
              </Fade>
            </Fade>
          </>
        ) : (
          <Alert
            className="detail-alert"
            message="매출 정보를 아직 집계하지 못했습니다."
            type="warning"
          />
        )}
      </div>
    );
  }
}

export default DetailTop;
