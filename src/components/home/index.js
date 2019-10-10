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
      // selectedIndex:'0',
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
      // showSlider: true,
      hasMarkedTodayAttendance: false,
      errorMsg: null,
      wfhDisabled: true,
      loading: true,
      location:null,
      errorMessage:null,
      position:null,
      locationPermission: false,
      submitLoading: false,
      showSubmitButton: true,
      flag_WFH: false,
      flag_PRESENT: false,
      selectedRadio: ''
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
    this.setState({flag_WFH: false, flag_PRESENT : false});
  }

  handleOption = async (option) => {
    let validWFH = true;
    if (option === 'wfh') {
      this.setState({flag_WFH: true});
      if ( !this.state.wfhDisabled ) {
        validWFH = false;
      }
    } else {
      this.setState({flag_PRESENT : true});
    }
    try {
      // window.navigator.vibrate(100);
      if ( !validWFH ) {
        this.setState({selectedOption: option});
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
    // if ( !gotGeolocation) {

    // }
    let result = await API.postAttendance(user_id, {status: this.state.selectedOption, geoLocation: this.state.geoLocation});
    console.log('submit result :',result)
    if (result.success ) {
      try {
        window.navigator.vibrate(100);
      } catch(err ) {
      }
      // this.setState({showSlider: false});
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
    this.setState({flag_PRESENT: false, flag_WFH: false});
  }

  checkIfAttendanceMarked = async () => {
    let result =  await API.getAttendance();
    this.setState({loading: false})
    if (result === true) {
      this.setState({hasMarkedTodayAttendance: result});
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
    if (hr <= 10) {
      this.setState({wfhDisabled: false});
    } 
    else if (hr === 10  &&  min <= 30) {
      this.setState({wfhDisabled: false});
    }
  }

  async componentDidMount () {
    console.log(' yo ');
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

    handleRadioChange = (reason) => {
      this.setState({selectedRadio: reason});
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
              {/* <Grow
                style={{ transformOrigin: '0 0 0' }}
                 timeout='1000'
              > */}
                <div className="content-greetings-primary">
                    welcome, {this.state.user.name}
                </div>
              {/* </Grow> */}
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
              {
                this.state.errorMsg ? 
                <span>{this.state.errorMsg}</span>
                : 
                <span>
                  MARK YOUR ATTENDANCE
                </span>
              }
            </div>
            {/* <Bounce > */}
              <div className="date-wrapper">
                <div className="date--wrapper-day">
                  {this.state.currentDay},
                </div>
                <div className="date-wrapper-date">
                  {this.state.currentDate}
                </div>
              </div>
            {/* </Bounce> */}
            {
              // this.state.flag_WFH ? 
              // <div>
              //     YO!
              // </div>
              // : 
                <div className="options-wrapper">
                  <div className="option-1" onClick={() => this.handleOption('wfh')}>
                    <Button variant="contained" className='option-button'>
                        Work from Home
                    </Button>
                  </div>
                  <div className="option-2" onClick={() => this.handleOption('present')}>
                    <Button variant="contained" className='option-button'>
                        Work from Office
                    </Button>
                  </div>
              </div>
            }
            {
            //   this.state.showSubmitButton ?
            //   <div className="submit-wrapper">
            //   {/* <Button variant="contained" className='submit'
            //   onClick={() => this.handleSubmit()}>
            //     {
            //       this.state.submitLoading ? <CircularProgress color="secondary" />
            //       : 'submit'
            //     }
            //   </Button> */}
            //   <h1> {this.state.errorMsg} </h1>
            // </div> : 
              // <div className="submit-wrapper">
              //   {/* <span> {this.state.errorMsg} </span> */}
              //   Abhay
              // </div>
            }
          </div>
          </Fade>
        }
        </div>  {/* content */}
        {/* <Snackbar
						anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
						open={this.state.open}
						onClose={() => this.handleClose()}
						ContentProps={{
						'aria-describedby': 'message-id',
            }}
            className="snackbar-wrapper"
						message={
            <div id="message-id" className="snackbar-text">
                <div>
                  {this.state.errorMsg}
                </div>
                <div>
                <CancelIcon />
                </div>
            </div>}
				/> */}
        <Dialog
          open={this.state.flag_WFH || this.state.flag_PRESENT}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className="dialog-wrapper"
        >
          <div className="dialog-wrapper-content">
            <DialogTitle id="alert-dialog-slide-title" className="">
              {/* {"Use Google's location service?"} */}
              { this.state.flag_WFH ? "WORK FROM HOME" : "OFFICE" }
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description" className="dialog-wrapper-content-text">
                { this.state.flag_WFH ?
                <div className="dialog-wrapper-radio-wrapper">
                  <span className="dialog-wrapper-radio-wrapper-wfh-text">
                    Please let us know the reasons for your working from home.
                  </span>
                  <div onClick={() => this.handleRadioChange('personal')}>
                    <Radio
                      checked={this.state.selectedRadio === 'personal'}
                      // onChange={() => this.handleRadioChange('personal')}
                      value="Personal reasons"
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'Personal Reasons' }}
                    />
                    Personal reasons
                  </div>
                  <div onClick={() => this.handleRadioChange('health')}>
                    <Radio
                      checked={this.state.selectedRadio === 'health'}
                      // onChange={() => this.handleRadioChange('health')}
                      value="Health issues"
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'Health issues' }}
                    />
                    Health issues
                  </div>
                  <div onClick={() => this.handleRadioChange('DontFeelLikeComing')}>
                    <Radio
                      checked={this.state.selectedRadio === 'DontFeelLikeComing'}
                      // onChange={() => this.handleRadioChange('DontFeelLikeComing')}
                      value="Don’t feel like coming"
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': 'Don’t feel like coming' }}
                    />
                    Don’t feel like coming
                  </div>
                    {/* <div className="submit-wrapper">
                      <Button variant="contained" className='submit'
                      onClick={() => this.handleSubmit()}>
                        {
                          this.state.submitLoading ? <CircularProgress color="secondary" />
                          : 'submit'
                        }
                      </Button>
                    </div> */}
              </div>
                 :
                  <div>
                    Hope you have a great day!
                  </div>
                  }
              </DialogContentText>
            </DialogContent>
            <DialogActions className="submit-button-wrapper">
              {/* <div className="submit-wrapper"> */}
                <Button variant="contained" className='submit'
                onClick={() => this.handleSubmit()}>
                  {
                    this.state.submitLoading ? <CircularProgress color="secondary" />
                    : 'submit'
                  }
                </Button>
              {/* </div> */}
            </DialogActions>
          </div>
        </Dialog>
        
    </div>
    )
  }
   
}

export default Home;
