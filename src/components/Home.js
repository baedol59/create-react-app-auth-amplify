import React, { Fragment } from 'react';
import Hero from './Hero';
import HomeContent from './HomeContent';
import { Auth } from 'aws-amplify';

export default function Home() {

  function handleClick(e) {
    e.preventDefault();
    // 생성정보 확인하여 팝업 띄우기.
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then( user => {
      console.log(user)
      //var url="https://rc.owl-checker.com/owl/awsin.mics?code="+user.username ;
      var url="http://localhost:8080/owl/awsin.mics?code="+user.username ;
      //localStorage.setItem("username", user.username ) ;

      var MeWin = window.open(url,
        "Online Wisdom Libray",
        'scrollbars=no,status=no,titlebar=no,toolbar=no,status=no,resizable=yes,menubar=no,location=no,width=1024, height=700' );
        // Puts focus on the newWindow
        if (window.focus) {
        	MeWin.focus();
        }
    }).catch( err => {
      console.log(err);
      alert ("ログインをお願いします。") ;
     });

  }

  return (
    <Fragment>
      <Hero />
      <div className="box cta">
        <p className="has-text-centered">
          <span>
            <button onClick={handleClick}>
              Online Wisdom Library 画面 開始
            </button>
          </span>
        </p>
      </div>
      <HomeContent />
    </Fragment>
  )
}
