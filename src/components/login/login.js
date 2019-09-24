import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import EmployeePage from '../employeePage/index'
// import Header from "../header/index";
import '../../App.css';
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
        this.setState({redirect:true});
        this.setState({result:response.profileObj.name});
        this.setState({email:response.profileObj.email});
        console.log("email",this.state.email);
        const pattern=/^[a-z0-9](\.?[a-z0-9]){5,}@qed42\.com$/;
        const patternResult= pattern.test(response.profileObj.email);
        console.log("res",patternResult);
        const emailId=this.state.email.split('@');
        console.log("emailId",emailId[1]);
        
        
      }
render(){
    return (
        <Router>
       {
           this.state.redirect?(
               <EmployeePage
                name={this.state.result}
               />
            // <Header
            // name={this.state.result}
            //  />
           ):
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