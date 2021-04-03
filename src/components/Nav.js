import React from 'react';
import './nav.css'
import {Link} from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { setTokenHeader } from '../services/api';

function Nav(props) {
  const history = useHistory();

  console.log(props)
  const logout=async ()=>{
    await localStorage.removeItem("token")
    await setTokenHeader(false)
    console.log(history)
    history.push('/')
  }
  return (
    <header className='navbar'>
      <div className='navbar__title navbar__item'>Helooo</div>
      {props.isLoggedIn ? 
         <div className='navbar__item'><a onClick={logout}>Logout</a></div>
      :
      <>
       <div className='navbar__item'><Link to='/signup'>Signup</Link></div>  
       <div className='navbar__item'><Link to='/'>Signin</Link></div>  
       </>
      }
    </header>
  )
}

export default Nav;
