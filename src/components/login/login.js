import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../home'
import '../../App.css';
import Cookie from '../../services/cookie';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';

class Login extends Component {
	constructor(props){
		super(props);
		this.state={
			redirect:false,
			result:'',
			email:'',
			emailId:'',
			open:false,
		}
	}
	
	handelClick = () => {
		this.setState({open:true});
	  };

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		this.setState({open:false});
	  };
	  
	timeValidation=()=>{
		// const hour = new Date().getHours();
		// const minutes=new 
	}
	
	responseGoogle = (response) => {
		console.log('google RES :', response);
		let payload = {
			title:'user',
			data: response.profileObj
		}
		this.setState({result:response.profileObj.name});
		this.setState({email:response.profileObj.email});
		const emailId=this.state.email.split('@');
		this.setState({emailId:emailId[1]})
		if(this.state.emailId==='qed42.com'){
			Cookie.setCookie(payload);
			this.setState({redirect:true});
		}else{
			this.handelClick();
		}
	}

render() {

	return (
		<Router>
			{
				this.state.redirect ? (
					<Home/>
				) :
				(
				<div className="loginScreen">
					<div>
					<img src={require('../../images/QED42.png')} />
					</div>
					<div>
					
					<GoogleLogin
					clientId="785790539959-ea8fvttmkdin1kg307dlmg4pr1ekdmqg.apps.googleusercontent.com"
					render={renderProps => (
						<button onClick={renderProps.onClick} disabled={renderProps.disabled}>
							<img src={require("../../images/login.png")}/>
						</button>
					  )}
					buttonText="LOGIN WITH GOOGLE"
					onSuccess={this.responseGoogle}
					onFailure={this.responseGoogle}
					/>
					</div>
					<Snackbar
						anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
						open={this.state.open}
						onClose={() => this.handleClose ()}
						ContentProps={{
						'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Please login with QED42's account.</span>}
					/>
				</div>
				)
			}
		</Router>
		);
  }
}

  export default Login;