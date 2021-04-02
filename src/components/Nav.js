import React from 'react';
import './nav.css'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';

function Nav(props) {
  const logged_out_nav = (
    <ul>
      <li onClick={() => props.display_form('login')}>login</li>
      <li onClick={() => props.display_form('signup')}>signup</li>
    </ul>
  );

  const logged_in_nav = (
    <ul>
      <li onClick={props.handle_logout}>logout</li>
    </ul>
  );
  return (
    <header className='navbar'>
      <div className='navbar__title navbar__item'>Helooo</div>
      <div className='navbar__item'><Link to='/'>Signup</Link></div>  
      <div className='navbar__item'><Link to='/signin'>Signin</Link></div>  
    </header>
  )
}

export default Nav;
