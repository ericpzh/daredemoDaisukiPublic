import React from 'react';

import { useWindowSize } from '../hooks/useWindowSize.js';
import './loader.css';
import load1 from '../assets/load1.png';
import load2 from '../assets/load2.png';
import load3 from '../assets/load3.png';
import load4 from '../assets/load4.png';
import load5 from '../assets/load5.png';
import load6 from '../assets/load6.png';

function Loader() {
  let { width } = useWindowSize();
  const imgstyle = {
    width: width/10,
    height: width/10
  }
  return (
    <div className="Loader">
      <div className='images'>
        <img className='image' style={imgstyle} src={load1} alt='404'/>
        <img className='image load2' style={imgstyle} src={load2} alt='404'/>
        <img className='image load3' style={imgstyle} src={load3} alt='404'/>
        <img className='image load4' style={imgstyle} src={load4} alt='404'/>
        <img className='image load5' style={imgstyle} src={load5} alt='404'/>
        <img className='image load6' style={imgstyle} src={load6} alt='404'/>
      </div>
    </div>
  );
}

export default Loader;
