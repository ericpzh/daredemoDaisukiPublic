import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './header/Header.js';
import Home from './home/Home.js';
import Login from './login/Login.js';
import Admin from './admin/Admin.js';
import Loader from './loader/Loader.js';
import { useUserState } from './contexts/userContext.js';
import './app.css';

const PrivateRoute = ({component: Component, authed}) => {
  return (
    <Route
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
  )
}

function App() {
  const { authed, loading } = useUserState();
  return (
    <div className="App">
    { loading && <Loader/> }

      <Header/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/login" component={Login}/>
        <PrivateRoute authed={authed} path='/admin' component = {Admin} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
