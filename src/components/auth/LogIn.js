import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";

class LogIn extends Component {
  state = {
    username: "",
    password: "",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    try {
      const user = await Auth.signIn(this.state.username, this.state.password);
      console.log(user);
      // --- start Add by bae
      if (user.challengeName === 'SMS_MFA' ||
            user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // You need to get the code from the UI inputs
            // and then trigger the following function with a button click
            //const code = getCodeFromUserInput();
            const code = prompt('SMS文字送信された[検証コード]を入力してください。' ,'');
	          console.log ( "verification code : " + code ) ;
            // If MFA is enabled, sign-in should be confirmed with the confirmation code
            const loggedUser = await Auth.confirmSignIn(
                user,   // Return object from Auth.signIn()
                code,   // Confirmation code
                user.challengeName // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
            );
            console.log ( "loggedUser : " + loggedUser) ;
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            console.log ( user.challengeName );
            // 계정상태 ::: FORCE_CHANGE_PASSWORD
            //const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
            // Todo. 화면으로 name 과 새로운비밀번호를 입력하는 모습으로 해야 할듯..
            const newPassword = prompt('新しいパスワードを入力してください。' ,'');
            Auth.completeNewPassword(
              user,
              newPassword,  // new password
              { name: this.state.username }
            ).then(use=>{
              // at this time the user is logged in if no MFA required
              console.log(user);
              if (user.challengeName==="SMS_MFA"){
                const validationcode = prompt('検証コードを入力してください' ,'');
                console.log ( "verification code : " + validationcode ) ;
                // If MFA is enabled, sign-in should be confirmed with the confirmation code
                const loggedUser = Auth.confirmSignIn(
                    user,   // Return object from Auth.signIn()
                    validationcode,   // Confirmation code
                    user.challengeName // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
                );
                console.log ( "loggedUser : " + loggedUser) ;
              }

            }).catch(e =>{
              console.log(e) ;
            });

        } else if (user.challengeName === 'MFA_SETUP') {
            // This happens when the MFA method is TOTP
            // The user needs to setup the TOTP before using it
            // More info please check the Enabling MFA part
            Auth.setupTOTP(user);
        } else {
            // The user directly signs in
            //console.log(user);
        }
      // --- end Add by bae
      this.props.auth.setAuthStatus(true);
      this.props.auth.setUser(user);
      //console.log ( user.username) ;
      this.props.history.push("/");
      // 로그인 확인되면 팝업띄우기.
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

    }catch(error) {

      // --- start Add by bae
      console.log(error.code);
      if (error.code === 'UserNotConfirmedException') {
          // 사용자가 등록할 때 확인 단계를 완료하지 않은 경우 오류가 발생함
          // 이 경우 코드를 다시 전송하고 사용자를 확인하십시오.
          // About how to resend the code and confirm the user, please check the signUp part
      } else if (error.code === 'PasswordResetRequiredException') {
          // The error happens when the password is reset in the Cognito console
          // 이 오류는 Cognito 콘솔에서 암호를 재설정할 때 발생함
          // 이 경우 암호를 재설정하려면 ForgetPassword를 호출해야 함
          // Please check the Forgot Password part.
      } else if (error.code === 'NotAuthorizedException') {
          // The error happens when the incorrect password is provided
      } else if (error.code === 'UserNotFoundException') {
          // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
          console.log(error);
      }
      // --- end Add by bae
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });

    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Log in</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter username or email"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/forgotpassword">Forgot password?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default LogIn;
