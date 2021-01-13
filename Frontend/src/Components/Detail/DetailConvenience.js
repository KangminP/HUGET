import React, { Component } from 'react';

// import image
import fix from '../../Assets/Images/fix2.png';
import truck from '../../Assets/Images/truck2.png';
import feeding from '../../Assets/Images/feeding2.png';
import sleep from '../../Assets/Images/sleep2.png';
import shower from '../../Assets/Images/shower2.png';
import drug from '../../Assets/Images/pharmacy2.png';
import laundary from '../../Assets/Images/laundry2.png';

// reactstrap
import { Row } from 'reactstrap';

// andt
import { Alert } from 'antd';

// css
import './DetailConvenience.css';

// react-reveal
import Zoom from 'react-reveal/Zoom';

// axios
import Axios from 'axios';

function FixImoticon(props) {
  if (props.fix) {
    const fixname = props.fixname;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={fix} alt="" />
            </div>
            <div className="conven-icon-bottombox">{fixname}</div>
          </div>
          <div className="under376-icon">{fixname}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

function TruckImoticon(props) {
  if (props.truck) {
    const truckname = props.truckname;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={truck} alt="" />
            </div>
            <div className="conven-icon-bottombox">{truckname}</div>
          </div>
          <div className="under376-icon">{truckname}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

function FeedingImoticon(props) {
  if (props.feeding) {
    const feedingname = props.feedingname;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={feeding} alt="" />
            </div>
            <div className="conven-icon-bottombox">{feedingname}</div>
          </div>
          <div className="under376-icon">{feedingname}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

function SleepImoticon(props) {
  if (props.sleep) {
    const sleepname = props.sleepname;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={sleep} alt="" />
            </div>
            <div className="conven-icon-bottombox">{sleepname}</div>
          </div>
          <div className="under376-icon">{sleepname}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

function ShowerImoticon(props) {
  if (props.shower) {
    const showername = props.showername;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={shower} alt="" />
            </div>
            <div className="conven-icon-bottombox">{showername}</div>
          </div>
          <div className="under376-icon">{showername}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

function DrugImoticon(props) {
  if (props.drug) {
    const drugname = props.drugname;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={drug} alt="" />
            </div>
            <div className="conven-icon-bottombox">{drugname}</div>
          </div>
          <div className="under376-icon">{drugname}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

function LaundryImoticon(props) {
  if (props.laundary) {
    const laundaryname = props.laundaryname;
    return (
      <div className="conven-icon-col col-sm-3 col-4">
        <Zoom clear>
          <div className="conven-icon-box">
            <div className="conven-icon-topbox">
              <img src={laundary} alt="" />
            </div>
            <div className="conven-icon-bottombox">{laundaryname}</div>
          </div>
          <div className="under376-icon">{laundaryname}</div>
        </Zoom>
      </div>
    );
  }
  return null;
}

class DetailConvenience extends Component {
  constructor() {
    super();
    this.state = {
      fix: true,
      truck: true,
      feeding: true,
      sleep: true,
      shower: true,
      drug: true,
      laundary: true,

      fix_name: '정비소',
      truck_name: '화물휴식',
      feeding_name: '수유실',
      sleep_name: '수면실',
      shower_name: '샤워실',
      drug_name: '약국',
      laundary_name: '세탁실',

      conven_arr: [],
    };

    this.getRestInfo = this.getRestInfo.bind(this);
    // const name = this.props.name;
    // console.log(name);
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
        rest_name: response.data.rest_name,
        rest_fix: response.data.rest[0].rest_fix,
        rest_truck: response.data.rest[0].rest_truck,
        rest_feeding: response.data.rest[0].rest_feeding,
        rest_sleep: response.data.rest[0].rest_sleep,
        rest_shower: response.data.rest[0].rest_shower,
        rest_drug: response.data.rest[0].rest_drug,
        rest_laundary: response.data.rest[0].rest_laundary,
      });

      const temp_arr = [];
      if (response.data.rest[0].rest_fix === true) {
        temp_arr.push(true);
      }
      if (response.data.rest[0].rest_truck === true) {
        temp_arr.push(true);
      }
      if (response.data.rest[0].rest_feeding === true) {
        temp_arr.push(true);
      }
      if (response.data.rest[0].rest_sleep === true) {
        temp_arr.push(true);
      }
      if (response.data.rest[0].rest_shower === true) {
        temp_arr.push(true);
      }
      if (response.data.rest[0].rest_drug === true) {
        temp_arr.push(true);
      }
      if (response.data.rest[0].rest_laundary === true) {
        temp_arr.push(true);
      }
      // console.log(temp_arr);
      this.setState({ conven_arr: temp_arr });
      // console.log(this.state.conven_arr);
    } catch (err) {
      console.log(err);
    }
  }
  componentDidMount() {
    this.getRestInfo();
  }

  render() {
    const fix = this.state.rest_fix;
    const truck = this.state.rest_truck;
    const feeding = this.state.rest_feeding;
    const sleep = this.state.rest_sleep;
    const shower = this.state.rest_shower;
    const drug = this.state.rest_drug;
    const laundary = this.state.rest_laundary;

    const fixname = this.state.fix_name;
    const truckname = this.state.truck_name;
    const feedingname = this.state.feeding_name;
    const sleepname = this.state.sleep_name;
    const showername = this.state.shower_name;
    const drugname = this.state.drug_name;
    const laundaryname = this.state.laundary_name;

    const convens = this.state.conven_arr;

    return (
      <div className="box effect">
        <div className="ml-1 mb-3 detail-box-title">편의시설</div>
        {convens.length > 0 ? (
          <Row
            className="px-2 detail-convenience-box"
            style={{ height: '100%' }}
          >
            <FixImoticon fix={fix} fixname={fixname} />
            <TruckImoticon truck={truck} truckname={truckname} />
            <FeedingImoticon feeding={feeding} feedingname={feedingname} />
            <SleepImoticon sleep={sleep} sleepname={sleepname} />
            <ShowerImoticon shower={shower} showername={showername} />
            <DrugImoticon drug={drug} drugname={drugname} />
            <LaundryImoticon laundary={laundary} laundaryname={laundaryname} />
          </Row>
        ) : (
          <Alert
            className="detail-alert"
            message="편의시설 정보가 없습니다."
            type="warning"
          />
        )}
      </div>
    );
  }
}

export default DetailConvenience;
