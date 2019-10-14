import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Header from '../header/index';
import Data from '../../services/data';
import API from '../../services/api';
import './style.css';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
// import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import PopUp from '../popup';
import Radio from '@material-ui/core/Radio';
import Pulse from 'react-reveal/Pulse';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import CancelIcon from '@material-ui/icons/Cancel';

// Transition

import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';


// Sliding dailog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
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
      hasMarkedTodayAttendance: false,
      todayAttendanceType: '',
      errorMsg: null,
      wfhDisabled: true,
      loading: true,
      location:null,
      position:null,
      locationPermission: false,
      submitLoading: false,
      showSubmitButton: true,
      flag_WFH: false,
      flag_PRESENT: false,
      selectedRadio: '',
      successResponse: ''
    }
    this.reRender = () => {
      console.log(' in re render');
      this.getGeoLocation();
    };
  }

  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


  handleClose = (event) => {
    console.log('snackbar closed');
    this.setState({flag_WFH: false, flag_PRESENT : false, errorMsg: null});
  }

  handleOption = async (option) => {
    let validWFH = true;
    this.setState({selectedOption: option});
    if (option === 'wfh') {
      this.setState({flag_WFH: true});
      if ( !this.state.wfhDisabled ) {
        validWFH = false;
      }
    } else {
      this.setState({flag_PRESENT : true});
    }
    try {
      if ( !validWFH ) {
        window.navigator.vibrate(100);
      } else {
        window.navigator.vibrate([200, 100, 200]);
      }
    } catch(err ) {
      console.log('vibration error :', err);
    }
  }

  handleSubmit = async () => {
    this.setState({submitLoading: true, errorMsg : null});
    let user_id = Data.getData('user')._id;
    let gotGeolocation = await this.getGeoLocation();
    console.log(' got geolocation :', gotGeolocation);
    let result = await API.postAttendance(user_id, {status: this.state.selectedOption, geoLocation: this.state.geoLocation, wfhReason: this.state.selectedRadio});
    this.checkIfAttendanceMarked();
    console.log('submit result :',result);
    if (result.success ) {
      try {
        window.navigator.vibrate(100);
      } catch(err ) {
      }
      this.setState({open:true, errorMsg: result.msg, hasMarkedTodayAttendance: true});
    } else {
      try {
        window.navigator.vibrate([200, 100, 200]);
      } catch(err ) {
      }
      this.setState({open:true, errorMsg: result.msg});
    }
    this.setState({showSubmitButton: false});
    this.setState({submitLoading: false})
  }

  checkIfAttendanceMarked = async () => {
    let result =  await API.getAttendance();
    console.log('hasMarkedTodayAttendance :', result);
    this.setState({loading: false})
    if ( result.attendanceMarked === true ) {
      this.setState(
        {
          hasMarkedTodayAttendance: result.attendanceMarked,
          todayAttendanceType: result.data.attendance[0].status
        });
    }
  }

  getGeoLocation = async () => {
    return new Promise( (resolve, reject) => {
      navigator.geolocation.getCurrentPosition (
        (position) => {
          let lat = position.coords.latitude
          let lng = position.coords.longitude
          let geoLocation = {lat: lat, lng: lng};
          console.log("getCurrentPosition Success " + lat + lng); // logs position correctly
          this.setState({locationPermission: true});
          this.setState({geoLocation});
          resolve(true);
        },
        (error) => {
          this.setState({locationPermission: false});
          console.error("geolocation error :",error);
          resolve(false);

        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      )
    })
  }

  checkIfValidTimeForWFH = ( ) => {
    let hr =  new Date().getHours();
    let min = new Date().getMinutes();
    if (hr < 10) {
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
    let day= new Date().toLocaleDateString('en-US', {weekday:'long'});
    let currentDate = date + ' ' + month;
    this.setState({user});
    this.setState({currentMonth:month});
    this.setState({user, currentDay:day, currentDate});
    await API.postUser({email:user.email});
    this.checkIfAttendanceMarked();
  }

  handleRadioChange = (reason) => {
    this.setState({selectedRadio: reason});
  }

  render () {

    return(
      <div className="wrapper_content">
        <div><Header /></div>
        <div className="main_wrapper">
          {
            this.state.loading ?
              (
                <div className="empCard loadingWrapper">
                  <CircularProgress color="secondary" />
                </div>
              )
              :
              // <Fade>
                <div className="content">
                  <div>
                    <div className="content-greetings-primary">
                      welcome, {this.state.user.name}
                    </div>
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
                    <div className="line"></div>
                  </div>
                  <div className="date-wrapper">
                    <div className="content-instruction">
                      <span>
                        MARK YOUR ATTENDANCE
                      </span>
                    </div>
                    <div className="date--wrapper-day">
                      {this.state.currentDay},
                    </div>
                    <div className="date-wrapper-date">
                      {this.state.currentDate}
                    </div>
                  </div>
                  {
                    this.state.wfhDisabled
                      ?
                    <div className="options-wrapper">
                      {
                        !this.state.hasMarkedTodayAttendance
                          ?
                          <div className="option-1" onClick={() => this.handleOption('wfh')}>
                            <Button variant="contained" className='option-button'>
                              Work from Home
                            </Button>
                          </div>
                          : null
                      }
                      {
                        this.state.hasMarkedTodayAttendance && this.state.todayAttendanceType !== 'wfh'
                          ?
                          null
                          :
                          <div className="option-2" onClick={() => this.handleOption('present')}>
                            <Button variant="contained" className='option-button'>
                              Work from Office
                            </Button>
                          </div>
                      }
                    </div>
                    : null
                  }
                </div>
              // </Fade>
          }
        </div>  {/* content */}
        <Dialog
          open={this.state.flag_WFH || this.state.flag_PRESENT}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className="dialog-wrapper"
        >
          <div
            className={this.state.errorMsg ? 'dialog-wrapper-content text-center' : 'dialog-wrapper-content'}
          >
            <DialogTitle id="alert-dialog-slide-title" className="">
              { this.state.flag_WFH ? "WORK FROM HOME" : "OFFICE" }
            </DialogTitle>
            <div>
              <div id="alert-dialog-slide-description" className="dialog-wrapper-content-text">
                { this.state.flag_WFH ?
                  <div className="dialog-wrapper-radio-wrapper">
                    {
                      !this.state.errorMsg
                        ?
                        <div>
                        <div className="dialog-wrapper-radio-wrapper-wfh-text">
                          Please let us know the reasons for your working from home.
                        </div>
                          <div onClick={() => this.handleRadioChange('personal')}>
                            <Radio
                              checked={this.state.selectedRadio === 'personal'}
                              value="Personal reasons"
                              name="radio-button-demo"
                              inputProps={{ 'aria-label': 'Personal Reasons' }}
                            />
                            Personal reasons
                          </div>
                          <div onClick={() => this.handleRadioChange('health')}>
                            <Radio
                              checked={this.state.selectedRadio === 'health'}
                              value="Health issues"
                              name="radio-button-demo"
                              inputProps={{ 'aria-label': 'Health issues' }}
                            />
                            Health issues
                          </div>
                          <div onClick={() => this.handleRadioChange('DontFeelLikeComing')}>
                            <Radio
                              checked={this.state.selectedRadio === 'DontFeelLikeComing'}
                              value="Don’t feel like coming"
                              name="radio-button-demo"
                              inputProps={{ 'aria-label': 'Don’t feel like coming' }}
                            />
                            Don’t feel like coming
                          </div>
                        </div>
                        :

                        <div>
                          {this.state.errorMsg} yolo
                        </div>
                    }
                  </div>
                  :
                  <div className='success-greetings'>
                    {
                      this.state.errorMsg ? 
                      <span> {this.state.errorMsg} </span>
                      : <span>
                        Mark your attendance here.
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
              <DialogActions className="submit-button-wrapper">
                {
                  !this.state.errorMsg
                  ?
                    <Button variant="contained" className='submit'
                            onClick={() => this.handleSubmit()}>
                      {
                        this.state.submitLoading ? <CircularProgress color="secondary" />
                          : 'submit'
                      }
                    </Button>
                    :
                    <Button
                      variant="contained"
                      className='submit'
                      onClick={() => this.handleClose()}>
                      {
                        this.state.submitLoading ? <CircularProgress color="secondary" />
                          : 'Close'
                      }
                    </Button>
                }
              </DialogActions>
            </div>
        </Dialog>

      </div>
    )
  }

}

export default Home;
