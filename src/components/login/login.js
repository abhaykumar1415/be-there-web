import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../home'
import '../../App.css';
import Cookie from '../../services/cookie';
class Login extends Component {
	constructor(props){
		super(props);
		this.state={
			redirect:false,
			result:'',
			email:'',
		}
	}
    
	responseGoogle = (response) => {
		console.log('google RES :', response);
		console.log("email",this.state.email);
		const pattern=/^[a-z0-9](\.?[a-z0-9]){5,}@qed42\.com$/;
		const patternResult= pattern.test(response.profileObj.email);
		console.log("res",patternResult);
		const emailId=this.state.email.split('@');
		console.log("emailId",emailId[1]);
		let payload = {
			title:'user',
			data: response.profileObj
		}
			Cookie.setCookie(payload);
			this.setState({redirect:true});
			this.setState({result:response.profileObj.name});
			this.setState({email:response.profileObj.email});
	}

render() {
	return (
		<Router>
			{
				this.state.redirect ? (
					<Home/>
				) :
				(
				<div className="margin-top">
					<GoogleLogin
					clientId="785790539959-ea8fvttmkdin1kg307dlmg4pr1ekdmqg.apps.googleusercontent.com"
					buttonText="LOGIN WITH GOOGLE"
					onSuccess={this.responseGoogle}
					onFailure={this.responseGoogle}
					/>
				</div>
				)
			}
		</Router>
		);
  }
}

  export default Login;