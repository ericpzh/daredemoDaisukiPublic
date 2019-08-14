import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { faAndroid, faApple, faGithub, faReact, faNodeJs, faNpm, faYoutube, faTwitter, faJs } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { useWindowSize } from '../hooks/useWindowSize.js';
import './home.css';
import './demo.css';
import'./download.css';
import './footer.css';
import homegif from '../assets/home.gif';
import suggestiongif from '../assets/suggestion.gif';
import searchgif from '../assets/search.gif';
import registergif from '../assets/register.gif';
import groupgif from '../assets/group.gif';
import subscriptionsgif from '../assets/subscriptions.gif';

const githublink = 'https://github.com/ericpzh/daredemoDaisukiPublic';
const expolink = 'https://expo.io/@ericsama/daredemoDaisuki';
const andriodlink = 'https://expo.io/artifacts/b4ee73a0-b508-4332-80dd-0bc8dc0a6260';
const ioslink = 'https://expo.io/@ericsama/daredemoDaisuki';

const Home = withRouter(({ location, history }) => {
  let { height, width } = useWindowSize();
  const isMobile = width < 768;
  const aspectRatio = 18.5/9;
  const demoStyle =
  !isMobile ?
  {
    width: (768/3.5).toString() + 'px',
    height: (aspectRatio * 768/3.5).toString() + 'px'
  } :
  {
    width: (width*0.7).toString() + 'px',
    height: (aspectRatio * width*0.7).toString() + 'px'
  };
  return (
    <div className='Home'>
      <link href='https://fonts.googleapis.com/css?family=Artifika' rel='stylesheet'/>
      <link href='https://fonts.googleapis.com/css?family=Alef' rel='stylesheet'/>
      <div className="home" id='home' style={{height:height}}>
        <div className="home-mask">
          <div className={isMobile?'title-mobile':'title'}>
            <h1 className='title-text'> {'Youtube, '} </h1>
            <h1 className='title-text'> {'Twitter, '} </h1>
            <h1 className='title-text'> {'Bilibili, '} </h1>
            <h1 className='title-text'> {'All '} </h1>
            <h1 className='title-text'> {'in '} </h1>
            <h1 className='title-text'> {'One '} </h1>
            <h1 className='title-text'> {'App! '} </h1>
          </div>
          <div className={'home-button-container'}>
            <a className='home-button andriod'  href={andriodlink}>
              <FontAwesomeIcon icon={faAndroid} size='2x'/>
              <h2 className='home-button-text'> Andorid </h2>
            </a>
            <a className='home-button ios' href={ioslink}>
              <FontAwesomeIcon icon={faApple} size='2x'/>
              <h2 className='home-button-text'> IOS </h2>
            </a>
          </div>
        </div>
      </div>
      <div className={
        classNames({
          'demo':true,
          'section-mobile':isMobile,
          'section':!isMobile
        })
      } id='demo'>
        <div className = 'section-demo-wrapper even'>
          <div className={classNames({
            'section-demo':true,
            'section-demo-mobile':isMobile
          })}>
            <div className='subsection'>
              <h1> Navigate Through Youtube, Twitter and Bilibili Feed in Ease </h1>
              <p>
              Get latest feed of your favorite Vtubers in one app.
              </p>
            </div>
            <div className='subsection'>
              <img style={demoStyle} src={homegif} alt='404'/>
            </div>
          </div>
        </div>
        <div className = 'section-demo-wrapper odd'>
          <div className={classNames({
            'section-demo':true,
            'section-demo-mobile':isMobile
          })}>
            {
              !isMobile &&
              <div className='subsection'>
                <img style={demoStyle} src={searchgif} alt='404'/>
              </div>
            }
            <div className='subsection'>
              <h1> Cross Source Search Between Platforms </h1>
              <p>
              Easy search from content on Youtube, Twitter, and Bilibli.
              </p>
            </div>
            {
              isMobile &&
              <div className='subsection'>
                <img style={demoStyle} src={searchgif} alt='404'/>
              </div>
            }
          </div>
        </div>
        <div className = 'section-demo-wrapper even'>
          <div className={classNames({
            'section-demo':true,
            'section-demo-mobile':isMobile
          })}>
            <div className='subsection'>
              <h1> Subscribe to Any Vtuber in a Click </h1>
              <p>
              Select from thousands of Vtubers in database.
              </p>
            </div>
            <div className='subsection'>
              <img style={demoStyle} src={subscriptionsgif} alt='404'/>
            </div>
          </div>
        </div>

        <div className = 'section-demo-wrapper odd'>
          <div className={classNames({
            'section-demo':true,
            'odd':true,
            'section-demo-mobile':isMobile
          })}>
            {
              !isMobile &&
              <div className='subsection'>
                <img style={demoStyle} src={groupgif} alt='404'/>
              </div>
            }
            <div className='subsection'>
              <h1> Organize Vtubers Into Groups </h1>
              <p>
              Switch between Tan oshi and Daredemo Daisuki in a click.
              </p>
            </div>
            {
              isMobile &&
              <div className='subsection'>
                <img style={demoStyle} src={groupgif} alt='404'/>
              </div>
            }
          </div>
        </div>

        <div className = 'section-demo-wrapper even'>
          <div className={classNames({
            'section-demo':true,
            'section-demo-mobile':isMobile
          })}>
            <div className='subsection'>
              <h1> Help Make Improvment to the Database </h1>
              <p>
              Add a tag to your favorite Vtuber, make modification suggestion to Vtuber in database, or make suggestion on new Vtubers.
              </p>
            </div>
            <div className='subsection'>
              <img style={demoStyle} src={suggestiongif} alt='404'/>
            </div>
          </div>
        </div>

        <div className = 'section-demo-wrapper odd'>
          <div className={classNames({
            'section-demo':true,
            'section-demo-mobile':isMobile
          })}>
            {
              !isMobile &&
              <div className='subsection'>
                <img style={demoStyle} src={registergif} alt='404'/>
              </div>
            }
            <div className='subsection'>
              <h1> Easy Registration, No Need For Email Account </h1>
              <p>
              Breeze through fast and easy registration process and enjoy contents from your favorite Vtubers.
              </p>
            </div>
            {
              isMobile &&
              <div className='subsection'>
                <img style={demoStyle} src={registergif} alt='404'/>
              </div>
            }
          </div>
        </div>
      </div>

      <div className={
        classNames({
          'download':true,
          'section-mobile':isMobile,
          'section':!isMobile
        })
      } id='download'>
        <h1> Download Center </h1>
        <a className='download-button andriod' href={andriodlink}>
          <FontAwesomeIcon icon={faAndroid} size='2x'/>
          <h2 className='download-button-text'> Andorid </h2>
          <h3> (0.1.3) </h3>
        </a>
        <a className='download-button ios' href={ioslink}>
          <FontAwesomeIcon icon={faApple} size='2x'/>
          <h2 className='download-button-text'> IOS </h2>
          <h3> (0.1.3) </h3>
        </a>
        <a className='download-button github' href={githublink}>
          <FontAwesomeIcon icon={faGithub} size='2x'/>
          <h2 className='download-button-text'> Source </h2>
        </a>
        <a className='download-button expo' href={expolink}>
          <h2> Latest Development Version </h2>
        </a>
      </div>

      <div className={!isMobile?"footer":'footer-mobile'}>
        <div className={!isMobile?"footer-words":"footer-words-mobile"}>
          <p className='footer-item'> Daredemo Daisuki </p>
          <p className='footer-item'> @2019 </p>
        </div>
        <div className={!isMobile?"footer-items":'footer-items-mobile'}>
          <p className='footer-item'> Powered by: </p>
          <FontAwesomeIcon icon={faReact} size='lg' className='footer-item'/>
          <FontAwesomeIcon icon={faJs} size='lg' className='footer-item'/>
          <FontAwesomeIcon icon={faNodeJs} size='lg' className='footer-item'/>
          <FontAwesomeIcon icon={faNpm} size='lg' className='footer-item'/>
          <FontAwesomeIcon icon={faYoutube} size='lg' className='footer-item'/>
          <FontAwesomeIcon icon={faTwitter} size='lg' className='footer-item'/>
        </div>
      </div>
    </div>);
});

export default Home;
