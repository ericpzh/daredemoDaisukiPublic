import React from 'react';

const UserStateContext = React.createContext();
const UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case 'login_start' : {
      return {loading: true};
    }
    case 'login_success': {
      localStorage.setItem("user", JSON.stringify(action.payload));
      action.history.push('/admin');
      return {...action.payload, loading: false};
    }
    case 'login_fail' : {
      alert('Login failed, please try again.')
      return {authed: false, loading: false};
    }
    case 'signup_start' : {
      return {loading: true};
    }
    case 'signup_success': {
      localStorage.setItem("user", JSON.stringify(action.payload));
      action.history.push('/admin');
      return {...action.payload, loading: false};
    }
    case 'signup_fail' : {
      alert('Sign up failed, please try again.')
      return {authed: false, loading: false};
    }
    case 'logout': {
      localStorage.removeItem("user");
      return {name:"",password:"",token:"",authed:false};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}


function UserProvider({children}) {
  const localState = JSON.parse(localStorage.getItem("user"));
  const [state, dispatch] = React.useReducer(userReducer, localState || {name:"",password:"",token:"",loading:false,authed:false});
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

function useUserState() {
  const context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider');
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
}

export {UserProvider, useUserState, useUserDispatch};
