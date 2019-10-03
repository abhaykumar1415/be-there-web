
import React, { useState, useRef, useEffect, Component } from 'react';
import Button from '@material-ui/core/Button';

import AttendancePage from '../attendancePage/index'
// import  GoogleLogout from 'react-google-login';
import Header from '../header/index';
import Cookie from '../../services/cookie';
import API from '../../services/api';
import ReactSwipe from 'react-swipe';
import Hammer from 'hammerjs';
import './style.css';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
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
      showSlider: true,
      hasMarkedTodayAttendance: false,
      errorMsg: '',
      wfhDisabled: true,
      loading: true
    }
  }

  handleClose = (event) => {
    if (this.state.anchorRef && this.state.anchorRef.contains(event.target)) {
      return;
    }
    this.setState({open:false})
  }

  handleOption = async (option) => {
    try {
      // window.navigator.vibrate(100);
      try {
        window.navigator.vibrate(100);
      } catch(err ) {
        console.log('vibration error :', err);
      }
    } catch(err ) {
      console.log('vibration error :', err);
    }
    // window.navigator.vibrate([200, 100, 200]);
    this.setState({selectedOption: option});

    // let user_id = Cookie.getCookie('user')._id;
    // console.log(' User in handle submit :', user_id);
    // let result = await API.postAttendance(user_id, {status: this.state.selectedOption, geoLocation: this.state.geoLocation});
    // console.log(" attendance submit result :", result);
    // if (result.success ) {

    // } else {
    //   window.navigator.vibrate([200, 100, 200]);
    //   this.setState({open:true, errorMsg: result.msg});
    // }
    
  }

  handleSwipe = async () => {
    let user_id = Cookie.getCookie('user')._id;
    await this.getGeoLocation();
    let result = await API.postAttendance(user_id, {status: this.state.selectedOption, geoLocation: this.state.geoLocation});
    if (result.success ) {
      try {
        window.navigator.vibrate(100);
      } catch(err ) {
        console.log('vibration error :', err);
      }
      this.setState({showSlider: false});
      this.setState({open:true, errorMsg: result.msg, hasMarkedTodayAttendance: true, showSlider: false});
    } else {
      try {
        window.navigator.vibrate([200, 100, 200]);
      } catch(err ) {
        console.log('vibration error :', err);
      }
      this.setState({open:true, errorMsg: result.msg});
    }
    // this.setState({showSlider: false});
  }

  checkIfAttendanceMarked = async () => {
    let result =  await API.getAttendance();
    this.setState({loading: false})
    if (result === true) {
      this.setState({hasMarkedTodayAttendance: result, showSlider: false});
    }

  }

  getGeoLocation = async () => {
    return await navigator.geolocation.getCurrentPosition (
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
        console.error("geolocation error :",error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      ) 
  }

  checkIfValidTimeForWFH = ( ) => {
    let hr =  new Date().getHours();
    let min = new Date().getMinutes();
    if (hr <= 10) {
      this.setState({wfhDisabled: false});
    } 
    else if (hr === 10  &&  min <= 30) {
      this.setState({wfhDisabled: false});
    }
  }
  async componentDidMount () {
    // this.sliderJs();
    this.checkIfValidTimeForWFH()
    this.getGeoLocation();
    
    // navigator.geolocation.getCurrentPosition (
    //   (position) => {
    //     let lat = position.coords.latitude
    //     let lng = position.coords.longitude
    //     console.log("getCurrentPosition Success " + lat + lng) // logs position correctly
    //     this.setState({
    //       geoLocation: {
    //         lat: lat,
    //         lng: lng
    //       }
    //     })
    //   },
    //   (error) => {
    //     //  this.props.displayError("Error dectecting your geoLocation");
    //     console.error(JSON.stringify(error))
    //   },
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    //   ) 

      let user = Cookie.getCookie('user');
      // console.log(' User in did  mouht :', user);
      this.setState({user});
      let date=new Date().toLocaleDateString('en-US', {day: 'numeric'})
      this.setState({currentDate:date});
      let month=new Date().toLocaleDateString('en-US', {month: 'short'})
      // new Date().toLocaleDateString('en-US', { month: 'short',timeZone: 'UTC' })
      this.setState({currentMonth:month});
      let year=new Date().toLocaleDateString('en-US', {year: 'numeric'})
      this.setState({currentYear:year});
      let day= new Date().toLocaleDateString('en-US', {weekday:'long'});
      this.setState({currentDay:day});
      let userFound = await API.postUser({email:user.email});
      this.checkIfAttendanceMarked();
      // console.log('userFound :', userFound);
      
    }

    getWFHClass = () => {
        if (this.state.wfhDisabled) {
          return "buttonDisabled";
        }
        else {
          if (this.state.selectedOption === "WFH") {
            return "buttonEnabled selected";
          } else {
            return "buttonEnabled";
          }
      } 
    }
    getPresentClass = () => {
        if (this.state.selectedOption === "PRESENT") {
          return "buttonEnabled selected";
        } else {
          return "buttonEnabled";
        }
    }

  render () {
    
  return(
    <div className="wrapper_content">
      <div><Header/></div>
        <div className="main_class">
          {
          this.state.loading ?
          (
            // <AttendancePage
            //   empName={this.state.user.name}
            // />
            <div className="empCard loadingWrapper">
              <CircularProgress color="secondary" />
              {/* <LinearProgress color="secondary" /> */}
            </div>
          )
          :
          <div className="empCard">
            <div className="cardHeader">
              <div><img className="dpWrapper" src={this.state.user.imageUrl} alt="displayPicture"/></div>
              <div className="empInfo">
               <div className="font_style ">{this.state.user.name}</div>
               <div className="font_style ">{this.state.currentDate} {this.state.currentMonth},{this.state.currentYear}</div>
               <div className="font_style">{this.state.currentDay}</div>
              </div>
            </div>

            <div className="swipeWrapper">

                {
                  !this.state.hasMarkedTodayAttendance ? 
                  <div className="ctaWrapper">
                        <Button variant="contained"
                          className={this.getWFHClass()}
                          onClick={() => this.handleOption('WFH')}
                          disabled={this.state.wfhDisabled}
                          >
                          WFH
                        </Button>
                        <Button variant="contained"
                          className={this.getPresentClass()}
                          onClick={() =>  this.handleOption('PRESENT')}
                          >
                          PRESENT
                        </Button>
                  </div>
                  : 
                  <div className="responseWrapper">
                        <span className="responseText">You have marked your attendance for today.</span>
                  </div>
                }
                  {
                    this.state.showSlider ? 
                    <div className="swipeElementWrapper">
                        <SwipeableList>
                          <SwipeableListItem
                            swipeRight={{
                              content: <div></div>,
                              action: () => this.handleSwipe()
                            }}
                          >
                            <div className="swipeElement">
                              {/* <div classNam="swipeElementText">O</div> */}
                              <img src={ require ("../../assets/redDot.png")} className="circle" alt="circle"/>
                            </div>
                          </SwipeableListItem>
                        </SwipeableList>
                    </div>
                    : null
                  }
            </div> {/* swipeWrapper*/}
          </div> /* empCard */
        }
        </div>  {/* main class */}
        <Snackbar
						anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
						open={this.state.open}
						onClose={() => this.handleClose ()}
						ContentProps={{
						'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">{this.state.errorMsg}</span>}
				/>
    </div>
    )
  }
   
}

export default Home;