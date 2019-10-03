
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Header from '../header/index';
import Data from '../../services/data';
import API from '../../services/api';
import './style.css';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import PopUp from '../popup';
import Radio from '@material-ui/core/Radio';
import Pulse from 'react-reveal/Pulse';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';


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
      selectedOption: 'present',
      user: {},
      geoLocation: {
        lat: 0,
        lng: 0
      },
      showSlider: true,
      hasMarkedTodayAttendance: false,
      errorMsg: '',
      wfhDisabled: true,
      loading: true,
      location:null,
      errorMessage:null,
      position:null,
      locationPermission: false
    }
    this.reRender = () => {
      console.log(' in re render');
      this.getGeoLocation();
    };
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
    this.setState({selectedOption: option});
  }

  handleSwipe = async () => {
    let user_id = Data.getData('user')._id;
    await this.getGeoLocation();
    let result = await API.postAttendance(user_id, {status: this.state.selectedOption, geoLocation: this.state.geoLocation});
    if (result.success ) {
      try {
        window.navigator.vibrate(100);
      } catch(err ) {
      }
      this.setState({showSlider: false});
      this.setState({open:true, errorMsg: result.msg, hasMarkedTodayAttendance: true, showSlider: false});
    } else {
      try {
        window.navigator.vibrate([200, 100, 200]);
      } catch(err ) {
      }
      this.setState({open:true, errorMsg: result.msg});
    }
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
        this.setState({locationPermission: true})
        this.setState({
          geoLocation: {
            lat: lat,
            lng: lng
          }
        })
      },
      (error) => {
        this.setState({locationPermission: false});
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
    this.checkIfValidTimeForWFH()
    this.getGeoLocation();
    let user = Data.getData('user');
    let date=new Date().toLocaleDateString('en-US', {day: 'numeric'})
    let month=new Date().toLocaleDateString('en-US', {month: 'short'})
    // let year=new Date().toLocaleDateString('en-US', {year: 'numeric'})
    let day= new Date().toLocaleDateString('en-US', {weekday:'long'});
    let currentDate = date + ' ' + month;
    // this.setState({currentDate:date});
    this.setState({user});
    this.setState({currentMonth:month});
    // this.setState({currentYear:year});
    this.setState({user, currentDay:day, currentDate});
    await API.postUser({email:user.email});
    this.checkIfAttendanceMarked();
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
      <div><Header /></div>
      {/* {
        !this.state.locationPermission ? 
        <PopUp />
        : null
      } */}
        <div className="main_wrapper">
          {
          this.state.loading ?
          (
            <div className="empCard loadingWrapper">
              <CircularProgress color="secondary" />
            </div>
          )
          :
          <Fade>
          <div className="content">
            <div>
              {/* <Pulse> */}
                <div className="content-greetings-primary">
                    welcome, {this.state.user.name}
                </div>
              {/* </Pulse> */}
              <div className="content-greetings-secondray">
                <div>
                  Hope you had a great 
                </div>
                <div>
                  sleep, time to start a fresh
                </div>
                <div>
                  day!
                </div>
              </div>
              <div className="line">
                _______
              </div>
            </div>
            <div className="content-instruction">
              MARK YOUR ATTENDANCE
            </div>
            <Bounce >
              <div className="date-wrapper">
                <div className="date--wrapper-day">
                  {this.state.currentDay},
                </div>
                <div className="date-wrapper-date">
                  {this.state.currentDate}
                </div>
              </div>
            </Bounce>
            <div className="options-wrapper">
              <div className="option-1" onClick={() => this.handleOption('wfh')}>
                <Radio
                  checked={this.state.selectedOption === 'wfh'}
                  // onChange={() => this.handleOption('wfh')}
                  value="wfh"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                /> Work From Home
              </div>
              <div className="option-2" onClick={() => this.handleOption('present')}>
                <Radio
                  checked={this.state.selectedOption === 'present'}
                  onChange={() => this.handleOption('present')}
                  value="office"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'B' }}
                /> Work from Office
              </div>
            </div>
            <div>
              {/* Submit */}
              <Button variant="contained" className="submit">
                Submit
              </Button>
            </div>
          </div>
          </Fade>
        }
        </div>  {/* content */}
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
