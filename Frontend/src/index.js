import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// router-dom
import { BrowserRouter as Router, Route } from 'react-router-dom';

// import components
import Home from './Contents/Home';
import SignUp from './Contents/SignUp';
import LogIn from './Contents/LogIn';
import Search from './Contents/Options/Search';
import Highway from './Contents/Options/Highway';
import Root from './Contents/Options/Root';
import Detail from './Contents/Detail';
import EditUser from './Contents/EditUser';
import SearchMenu from './Contents/SearchMenu';

class App extends Component {
  render() {
    return (
      <div className="router">
        <Route exact path="/" component={Home}></Route>
        <Route path="/Home" component={Home}></Route>
        <Route path="/Login" component={LogIn}></Route>
        <Route path="/Signup" component={SignUp}></Route>
        <Route path="/Search" component={Search}></Route>
        <Route path="/Highway" component={Highway}></Route>
        <Route path="/Root" component={Root}></Route>
        <Route path="/Detail/:name" component={Detail}></Route>
        {/* <Route path="/EditUser" component={EditUser}></Route> */}
        <Route path="/EditUser" component={EditUser}></Route>
        <Route path="/SearchMenu" component={SearchMenu}></Route>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
