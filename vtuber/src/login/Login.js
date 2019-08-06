import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import './login.css';
import { useUserDispatch } from '../contexts/userContext.js';
import { useWindowSize } from '../hooks/useWindowSize.js';

const Login = withRouter(({ history }) => {
  const [name,setName] = React.useState('');
  const [password,setPassword] = React.useState('');
  const [token,setToken] = React.useState('');
  let { height, width } = useWindowSize();
  const isMobile = width < 768;
  const dispatch =  useUserDispatch();
  async function login(dispatch, name, password, history) {//handle login
    if(name === '' || password === ''){//if empty field
      alert('Please fill in both name and password');
    }else{
      dispatch({type: 'login_start'});//start loading
      try{
        const url = 'https://daredemodaisuki.herokuapp.com/api/admins/login?name='+name+'&password='+password;
        let response = await fetch(url);
        let res = await response.json()
        const user = {name: res.data.name, password: res.data.password, token: res.data.token, authed: true};
        dispatch({type: 'login_success', payload: user, history: history})//success
      }catch{
        dispatch({type: 'login_fail'});//fail
      }
    }
  }
  async function signup(dispatch, name, password, token, history) {//handle signup
    if(name === '' || password === '' || token === ''){//if empty field
      alert('Please fill in both name, password and token');
    }else{
      dispatch({type: 'signup_start'});//start loading
      try{
        const url = 'https://daredemodaisuki.herokuapp.com/api/admins';
        let response = await fetch(url,{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'name': name, 'password': password, 'token': token}),
        });
        let res = await response.json()
        const user = {name: res.data.name, password: res.data.password, token: res.data.token, authed: true};
        dispatch({type: 'signup_success', payload: user, history: history})//success
      }catch{
        dispatch({type: 'signup_fail'});//fail
      }
    }
  }
  return (
    <div className='Login'>
      <link href='https://fonts.googleapis.com/css?family=Artifika' rel='stylesheet'/>
      <link href='https://fonts.googleapis.com/css?family=Alef' rel='stylesheet'/>
      <div className="login" style={{height:isMobile?height*2.5:height-0.5}}>
        <div className="login-mask" style={{paddingTop: isMobile && '100px', justifyContent: isMobile && 'flex-start'}}>
          <div className={isMobile?'title-mobile':'title'}>
            <h1 className='title-text'> Admin Portal </h1>
          </div>
          <div className={isMobile?'form-mobile':'form'}>
            <div className={!isMobile?'input-container':'input-container-mobile'}>
              <input className='input' placeholder='name' autoFocus value={name} onChange={({target})=>setName(target.value)}/>
            </div>
            <div className={!isMobile?'input-container':'input-container-mobile'}>
              <input className='input' placeholder='password' type='password' value={password} onChange={({target})=>setPassword(target.value)}/>
            </div>
            <div className={!isMobile?'input-container':'input-container-mobile'}>
              <input className='input' placeholder='invitation code(sign up only)' type='password' value={token} onChange={({target})=>setToken(target.value)}/>
            </div>
            <div className='button-group'>
              <div className='signin button' onClick={() => login(dispatch, name, password, history)}>
                <FontAwesomeIcon icon={faSignInAlt} size='lg'/>
                <h2 className='button-text'> Sign In </h2>
              </div>
              <div className='signup button' onClick={() => signup(dispatch, name, password, token, history)}>
                <FontAwesomeIcon icon={faUserPlus} size='lg'/>
                <h2 className='button-text'> Sign Up </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
});

export default Login;
