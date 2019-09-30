
import React, { useState, useRef, useEffect, Component } from 'react';
import Button from '@material-ui/core/Button';

import AttendancePage from '../attendancePage/index'
// import  GoogleLogout from 'react-google-login';
import Header from '../header/index';
import Cookie from '../../services/cookie';
import API from '../../services/api';
import ReactSwipe from 'react-swipe';
import Hammer from 'hammerjs';
// import './slider.css';
// import './slider.js';


import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';




class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      selectedIndex:'0',
      redirect:false,
      anchorRef:null,
      currentDate:'',
      currentDay:'',
      currentMonth:'',
      currentYear:'',
      selectedOption: 'PRESENT',
      user: {},
      geoLocation: {
        lat: 0,
        lng: 0
      },
      showSlider: true
    }
  }

  handleClose = (event) => {
    if (this.state.anchorRef && this.state.anchorRef.contains(event.target)) {
      return;
    }
    this.setState({open:false})
  }

  handleSubmit = async () => {
    console.log(' In submit button');
    console.log(' this.state.user in  :', this.state.user._id);
    let user_id = Cookie.getCookie('user')._id;
    console.log(' User in handle submit :', user_id);
    let result = await API.postAttendance(user_id, {status: this.state.selectedOption, geoLocation: this.state.geoLocation});
    console.log(" attendance submit result :", result);
    
  }

  handleSwipe(){
    console.log('swipe')
    this.setState({showSlider: false});
  }

  async componentDidMount () {
    // this.sliderJs();
    navigator.geolocation.getCurrentPosition (
      (position) => {
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
        //  this.props.displayError("Error dectecting your geoLocation");
        console.error(JSON.stringify(error))
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      ) 
      let user = Cookie.getCookie('user');
      console.log(' User in did  mouht :', user);
      this.setState({user});
      let date=new Date().toLocaleDateString('en-US', {day: 'numeric'})
      this.setState({currentDate:date});
      let month=new Date().toLocaleDateString('en-US', {month: 'long'})
      this.setState({currentMonth:month});
      let year=new Date().toLocaleDateString('en-US', {year: 'numeric'})
      this.setState({currentYear:year});
      let day= new Date().toLocaleDateString('en-US', {weekday:'long'});
      this.setState({currentDay:day});
      let userFound = await API.postUser({email:user.email});
      console.log('userFound :', userFound);
      
    }

  render () {
    
  return(
    <div className="wrapper_content">
      <div><Header/></div>
        <div className="main_class">
          {
          this.state.redirect ?
          (
            <AttendancePage
              empName={this.state.user.name}
            />
          ):
          <div className="empCard">
            <div className="cardHeader">
              <div><img src={this.state.user.imageUrl}/></div>
              <div className="empInfo">
               <div className="font_style ">{this.state.user.name}</div>
               <div className="font_style ">{this.state.currentDate},{this.state.currentMonth},{this.state.currentYear}</div>
               <div className="font_style">{this.state.currentDay}</div>
              </div>
            </div>
          <div className="EmpPageWrapper" >
           
            <Button variant="contained"
              style={{backgroundColor:'#EB1F4A',color:'#FFFFFF',borderRadius: '5px',padding:'16px 50px'}}
              onClick={this.handleSubmit}
              className="margin-left">
              WFH
            </Button>
            <Button variant="contained"
              style={{backgroundColor:'#EB1F4A',color:'#FFFFFF',borderRadius: '5px',padding:'16px 35px'}}
              onClick={this.handleSubmit}
              className="margin-left">
              PRESENT
            </Button>
            </div>
            <div className="swipeWrapper">
            {
              this.state.showSlider ? 
                <SwipeableList>
                <SwipeableListItem
                  swipeRight={{
                    content: <div></div>,
                    action: () => this.handleSwipe()
                  }}
                >
                  <div >
                    Swipe to submit
                  </div>
                </SwipeableListItem>
              </SwipeableList>
              : null
            }
            </div>
          </div>
           
        }
        </div>
    </div>
    )
  }
   
}

export default Home;