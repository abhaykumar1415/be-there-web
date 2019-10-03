import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../home'
import '../../App.css';
import Data from '../../services/data';
import Snackbar from '@material-ui/core/Snackbar';
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
		console.log(' Google res :', response);
		let result = response.profileObj;
		result.name = result.name.split(' ')[0];
		let payload = {
			title:'user',
			data: result
		}
		this.setState({result:response.profileObj.name});
		this.setState({email:response.profileObj.email});
		const emailId=this.state.email.split('@');
		this.setState({emailId:emailId[1]})
		if (this.state.emailId==='qed42.com') {
			Data.setData(payload);
			this.setState({redirect:true});
		} else {
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
						default: 
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
					<div className="mainImage-wrapper">
						<img className="mainImage" src={require('../../assets/login.png')} alt="mainImage" />
					</div>
					<div className="content-wrapper">
						<div className='content-wrapper-image'>
							<img className="content-wrapper-image-logo" src={require('../../assets/qed_logo.png')} alt="mainImage" />
						</div>
						<div className='content-wrapper-text-wrapper-1'>
							WHERE ARE YOU WORKING FROM?
						</div>
						<div className='content-wrapper-text-wrapper-2'>
							<div className='content-wrapper-text-wrapper-3'>
								Tell us your work location,
							</div>
							<div className='content-wrapper-text-wrapper-4'>
								your teammates will bring
							</div>
							<div className='content-wrapper-text-wrapper-5'>
								you some cookies
							</div>
						</div>
					</div>
					<div>
						<GoogleLogin
						clientId="785790539959-ea8fvttmkdin1kg307dlmg4pr1ekdmqg.apps.googleusercontent.com"
						// render={renderProps => (
						// 	<button onClick={renderProps.onClick} disabled={renderProps.disabled} className="googleBtn">
						// 		<img src={require("../../images/login.png")} alt="googleLogin"/>
						// 	</button>
						// 	)}
								buttonText="Sign in with Google"
								className="googleBtn"
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
