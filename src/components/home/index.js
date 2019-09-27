
import React, { useState, useRef, useEffect, Component } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AttendancePage from '../attendancePage/index'
// import  GoogleLogout from 'react-google-login';
import Header from '../header/index';
import Cookie from '../../services/cookie';
import API from '../../services/api';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const options = ['PRESENT','WFH'];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      selectedIndex:'0',
      redirect:false,
      anchorRef:null,
      currentDate:'',
      selectedOption: 'PRESENT',
      user: {},
      geoLocation: {
        lat: 0,
        lng: 0
      },
    }
  }

  handleClick = () => {
    // alert(`You clicked ${options[this.state.selectedIndex]}`);
  }

  handleToggle = () => {
    this.setState({open:true});   
  }
    
  handleMenuItemClick = (event, index) => {
    console.log('Submit called :', index);
    this.setState({selectedOption: options[index]});
    console.log('option :', options[index]);
    this.setState({open:!this.state.open});
    this.setState({selectedIndex:index});
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
    // this.setState({redirect:true});

  }

  async componentDidMount () {
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
    let date=new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    this.setState({currentDate:date});
    let userFound = await API.postUser({email:user.email});
    console.log('userFound :', userFound);
    
    }   

    
  render () {
    
  return(
    <div className="wrapper_content">
      <div><Header/></div>
        <div  className="main_class">
          {
          this.state.redirect ?
          (
            <AttendancePage
              empName={this.state.user.name}
            />
          ):
          <div className="attendanceCard" style={{ borderRadius: '40px',marginTop:'30%'}}>
            <CardContent className="EmpPageWrapper">
              <div className="text-align cardHeader">
               {this.state.user.name}
              </div>
            <div className="text-align margin_bottom-40 font_style ">{this.state.currentDate}</div>
            <CardActions className="button_wrapper ">
              <ButtonGroup
                variant="contained"
                style={{backgroundColor:'#EB1F4A',color:'#FFFFFF',borderRadius: '12px'}}
                ref={this.state.anchorRef}
                aria-label="split button"
                className="margin-right">
                  <Button  
                    style={{
                      backgroundColor:'#EB1F4A',
                      color:'#FFFFFF',
                      borderTopLeftRadius: '12px',
                      borderBottomLeftRadius: '12px'
                      }}
                      onClick={this.handleClick}>{options[this.state.selectedIndex]}
                  </Button>
                  <Button
                      style={{backgroundColor:'#EB1F4A',color:'#FFFFFF',borderRadius: '12px'}}
                      size="small"
                      aria-owns={this.state.open ? 'menu-list-grow' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleToggle}
                  >
                    <ArrowDropDownIcon />
                  </Button>
              </ButtonGroup>
              <Popper open={this.state.open} anchorEl={this.state.anchorRef} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                  {...TransitionProps}
                  style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                  >
                  <Paper id="menu-list-grow" >
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList>
                        { options.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === this.state.selectedIndex}
                            onClick={event => this.handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                      ))}
                     </MenuList>
                    </ClickAwayListener>
                  </Paper>
                  </Grow>
                )}
              </Popper>
              <Button
                variant="contained"
                style={{backgroundColor:'#EB1F4A',color:'#FFFFFF',borderRadius: '12px'}}
                onClick={this.handleSubmit}
                className="margin-left">
                  Submit
              </Button>
            </CardActions>
            </CardContent>
          </div>
        }
        </div>
    </div>
    )
  }
   
}

export default Home;