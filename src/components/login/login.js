import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../home'
import '../../App.css';
import Cookie from '../../services/cookie';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import './login.css';
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


	componentDidMount = () => {
		
		navigator.geolocation.getCurrentPosition (
			(position) => {
				console.log('pos : ', position)
				if(position=== null){
					console.log("error")
				}
		
				let lat = position.coords.latitude
				let lng = position.coords.longitude
				console.log("getCurrentPosition Success " + lat + lng) // logs position correctly
				this.setState({
				  geoLocation: {
					lat: lat,
					lng: lng
				  }
				})

			},
			(error) => {
				//this.props.displayError("Error dectecting your geoLocation");
			  	// console.error(JSON.stringify(error))
			  console.log("err:",error);
				alert("You Denied Application Permissions");
				switch(error) {
					case error.PERMISSION_DENIED:
						alert(" You Denied Application Permissions");
						break;
					case error.POSITION_UNAVAILABLE:
						alert("POSITION_UNAVAILABLE");
						break;
					case error.TIMEOUT:
						alert("TIMEOUT");
						break;
					case error.UNKNOWN_ERROR:
						alert("UNKNOWN_ERROR");
						break;
				}
			},
			{enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
			) 
	}

render() {

	return (
		<Router>
			{
				this.state.redirect ? (
					<Home />
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
						<button onClick={renderProps.onClick} disabled={renderProps.disabled} className="googleBtn">
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