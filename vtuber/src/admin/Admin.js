import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCheck, faTimes, faRandom } from '@fortawesome/free-solid-svg-icons'

import { useUserDispatch, useUserState } from '../contexts/userContext.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import './admin.css';

const Admin = withRouter(({ location, history }) => {
  let { height } = useWindowSize();
  const [post,setPost] = React.useState();
  const dispatch =  useUserDispatch();
  let { token } = useUserState();
  React.useEffect(()=>{
    const meta = document.getElementsByName('viewport')[0];//setup mobile viewport
    meta.content = 'width=768';
    document.head.appendChild(meta);
    return () => {
      meta.content = 'width=device-width, initial-scale=1';//return to normal view port
    }
  },[])
  React.useEffect(() => {
    getOne();
  }, []);
  const getOne = () => {//handel random click
    const url = 'https://daredemodaisuki.herokuapp.com/api/suggestions/random';
    fetch(url)
    .then(response => response.json())
    .then(res => {
      setPost(res.data);
    })
    .catch(e=>console.log(e))
  }
  const approve = () => {//handel approve click
    const url = 'https://daredemodaisuki.herokuapp.com/api/suggestions/approve?enname='+post.enname+'&suggestedBy='+post.suggestedBy+'&token='+token;
    fetch(url,{
      method: 'PUT',
    })
    .then(response => response.json())
    .then(res=>{
      if(res.data){
        getOne();
      }else{
        alert("Something's wrong");
      }
    })
    .catch((e)=>console.log(e))
  }
  const decline = () => {//handel decline click
      const url = 'https://daredemodaisuki.herokuapp.com/api/suggestions/decline?enname='+post.enname+'&suggestedBy='+post.suggestedBy+'&token='+token;
      fetch(url,{
        method: 'PUT',
      })
      .then(response => response.json())
      .then(res=>{
        if(res.data){
          getOne();
        }else{
          alert("Something's wrong");
        }
      })
      .catch((e)=>console.log(e))
  }
  return (
    <div className='Admin'>
      <link href='https://fonts.googleapis.com/css?family=Alef' rel='stylesheet'/>
      <div className='admin' style={{height:height-0.5}}>
        <div className='mask'>
          <div/>
          {
            !post &&
            (
              <h1> No Suggestion Available </h1>
            )
          }
          {
            !post &&
            (
              <div/>
            )
          }
          {
          post &&
          (
          <div className='info-group'>
            <div className='info-item'>
              <h3 className='info-item-title'> Name: </h3>
              <h3>{ post.name }</h3>
            </div>
            <div className='info-item'>
              <h3 className='info-item-title'> EN Name: </h3>
              <h3>{ post.enname }</h3>
            </div>
            <div className='info-item'>
              <h3 className='info-item-title'> Source: </h3>
              <h3>{ post.thumbnailSource }</h3>
            </div>
            {
              post.tags[0] &&
              <div className='info-item'>
                <h3 className='info-item-title'> Tag: </h3>
                <h3>{ post.tags.join(',') }</h3>
              </div>
            }
            <div className='link-group'>
              <a href={"http://www.youtube.com/channel/" + post.youtubeId} target="_blank" className='link button'>Youtube</a>
              <a href={"http://www.twitter.com/" + post.twitterId} target="_blank" className='link button'>Twitter</a>
              {post.biliId !== '0' &&
              <a href={"https://space.bilibili.com/" + post.biliId} target="_blank" className='link button'>Bilibili</a>
              }
            </div>
            <div className='info-item'>
              <h3 className='info-item-title'> By: </h3>
              <h3>{ post.suggestedBy }</h3>
            </div>
            <div className='info-item'>
              <h3 className='info-item-title'> At: </h3>
              <h3>{ post.createdAt.toString() }</h3>
            </div>
          </div>
          )}
          {
          post &&
          (
          <div className='button-group'>
            <div className='approve button' onClick={() => {
              approve();
            }}>
              <FontAwesomeIcon icon={faCheck} size='lg'/>
              <h2 className='button-text'> Approve </h2>
            </div>
            <div className='decline button' onClick={() => {
              decline();
            }}>
              <FontAwesomeIcon icon={faTimes} size='lg'/>
              <h2 className='button-text'> Decline </h2>
            </div>
            <div className='skip button' onClick={() => {
              getOne();
            }}>
              <FontAwesomeIcon icon={faRandom} size='lg'/>
              <h2 className='button-text'> Skip </h2>
            </div>
            <div className='logout button' onClick={() => {
              dispatch({type: 'logout'});
            }}>
              <FontAwesomeIcon icon={faSignOutAlt} size='lg'/>
              <h2 className='button-text'> Sign Out </h2>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>);
});

export default Admin;
