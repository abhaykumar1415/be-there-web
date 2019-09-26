
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



const options = ['present','WFH'];
   
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        open:false,
        selectedIndex:'0',
        redirect:false,
        anchorRef:null,
        currentDate:'',
        selectedOption: 'present',
        user: {}
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
      let result = await API.postAttendance(this.state.user._id, {status: this.state.selectedOption});
      console.log(" attendance submit result :", result);
      // this.setState({redirect:true});
    }

    async componentDidMount() {
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
        <div >
        {console.log('state :', this.state.user.name)} 
            {
          this.state.redirect ?
          (
            <AttendancePage
              empName={this.state.user.name}
            />
          ):
          <div className="EmpPageWrapper">
            <div>
              <div className="text-align margin_bottom">
                <h1>{this.state.user.name}</h1>
              </div>
            </div>
            <div className="text-align margin_bottom">{this.state.currentDate}</div>
            <div className="button_wrapper ">
              <ButtonGroup
                variant="contained"
                color="primary"
                ref={this.state.anchorRef}
                aria-label="split button"
                className="margin-right">
                  <Button onClick={this.handleClick}>{options[this.state.selectedIndex]}</Button>
                  <Button
                      color="primary"
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
          color="secondary"
          onClick={this.handleSubmit}
          className="margin-left">
            Submit
        </Button>
    
          </div>
          </div>
      }
        </div>
        </div>
    )
  }
   
}

export default Home;