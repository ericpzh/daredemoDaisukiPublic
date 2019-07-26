import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Link, animateScroll as scroll } from "react-scroll";
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { useWindowSize } from '../hooks/useWindowSize.js';
import { useWindowScroll } from '../hooks/useWindowScroll.js';
import './header.css';

const transitionStyle = {
  'WebkitTransition': 'all 0.5s ease-in-out',
  'MozTransition': 'all 0.5s ease-in-out',
  'OTransition': 'all 0.5s ease-in-out',
  'transition': 'all 0.5s ease-in-out',
};

const HeaderLink =  ({pathname, text, to, elseTo, isMobile, isTop, setMenuExpandedFinished, setMenuExpanded}) => {
  const linkStyle = {
    padding: !isMobile ? '15px' : '15px 30px' ,
    fontFamily: 'Artifika',
    letterSpacing: '0.1px',
    fontSize: !isMobile && !isTop?'15px':'18px',
    textDecoration: 'none',
    ...transitionStyle
  };
  if(pathname === elseTo){
    return (
      <Link
        style={ linkStyle }
        className='header-item'
        activeClass={ !isMobile && !isTop ? 'header-item-active' : ''}
        onClick={()=>{setMenuExpandedFinished(false);setMenuExpanded(false);}}
        to={ to }
        spy={true}
        smooth={true}
        offset={-80}
        duration={500}
        isDynamic={true}
      >
        { text }
      </Link>
    )
  }else{
    return (
      <NavLink
        className='header-item'
        style={ linkStyle }
        to={ elseTo }
        onClick={()=>{setMenuExpandedFinished(false);setMenuExpanded(false);}}
      >
        { text }
      </NavLink>
    )
  }
}

const Header = withRouter(({ location, history }) => {
  let { width } = useWindowSize();
  const isMobile = width < 768;
  let { scrollY } = useWindowScroll();
  const isTop = scrollY <= 0;
  const [menuExpanded,setMenuExpanded] = React.useState(false);
  const [menuExpandedFinished,setMenuExpandedFinished] = React.useState(false);
  const logoStyle = {
    fontSize: !isMobile && isTop?'30px':'25px',
    padding: !isMobile ? '0 15px' : '0 0 0 30px',
    ...transitionStyle,
  }
  React.useEffect(()=>{//if change from mobile to desktop, retract menu
    if(!isMobile){
      setMenuExpanded(false);
      setMenuExpandedFinished(false);
    }
    return;
  },[isMobile]);
  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Artifika' rel='stylesheet'/>
      <div className={
        classNames({
          'header':true,
          'header-mobile':isMobile,
          'header-lg':!isMobile && isTop,
          'header-sm':!isMobile && !isTop
        })
      }>
        <div className="header-container">
          <div className='header-item-container logo-container' onClick={()=>scroll.scrollToTop()}>
            <h1 style={logoStyle} className='header-logo'> Vtubers Feed </h1>
          </div>
          {
            isMobile
            ?
            <CSSTransition
              in={menuExpanded}
              timeout={500}
              classNames='menu-icon'
            >
            <div className='header-item-container expandable-container'>
              <FontAwesomeIcon icon={faBars} size="lg" onClick={()=>{!menuExpanded&&setMenuExpandedFinished(true);setMenuExpanded(!menuExpanded);}}/>
            </div>
            </CSSTransition>
            :
            <div className='header-item-container button-container'>
              <HeaderLink pathname={location.pathname} text='Home' to='home' elseTo='/' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
              <HeaderLink pathname={location.pathname} text='Demo' to='demo'elseTo='/' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
              <HeaderLink pathname={location.pathname} text='Download' to='download' elseTo='/' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
              <HeaderLink pathname={location.pathname} text='Admin' to='admin' elseTo='/admin' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
            </div>
          }
        </div>
      </div>
      <div className='expanded-header'>
        <CSSTransition
          in={menuExpanded}
          timeout={500}
          classNames="menu-expanded"
          onExited={() => {setMenuExpandedFinished(false)}}
          >
          {
            menuExpandedFinished ?
          <div className='header-expanded-menu'>
            <HeaderLink pathname={location.pathname} text='Home' to='home' elseTo='/' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
            <HeaderLink pathname={location.pathname} text='Demo' to='demo'elseTo='/' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
            <HeaderLink pathname={location.pathname} text='Download' to='download' elseTo='/' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
            <HeaderLink pathname={location.pathname} text='Admin' to='admin' elseTo='/admin' isMobile={isMobile} isTop={isTop} setMenuExpandedFinished = {setMenuExpandedFinished} setMenuExpanded = {setMenuExpanded}/>
          </div>
          : <div/>
          }

        </CSSTransition>
      </div>
    </div>
  );
});

export default Header;
