
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
import Header from '../header/index'
const options = ['Present','WFH'];
   
class EmployeePage extends Component {
    constructor(props){
        super(props);
        this.state={
            open:false,
            selectedIndex:'1',
            redirect:false,
            anchorRef:null,
            currentDate:'',
        }
    }
    handleClick=()=> {
        alert(`You clicked ${options[this.state.selectedIndex]}`);
    }

    handleToggle=()=> {
        this.setState({open:true});   
    }
    
    handleMenuItemClick=(event, index) =>{
        this.setState({open:!this.state.open});
        this.setState({selectedIndex:index})
    }

    handleClose=(event)=> {
        if (this.state.anchorRef && this.state.anchorRef.contains(event.target)) {
        return;
    }
        this.setState({open:false})
    }

    handleSubmit=()=>{
        this.setState({redirect:true});
    }

    componentDidMount() 
    { 
        let date=new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
        this.setState({currentDate:date});
    }   
    render(){
    
    return(
        <div className="wrapper_content">
            <div><Header/></div>
        <div >
            
            {
          this.state.redirect?
          (
            <AttendancePage
            empName={this.props.name}
            />
          ):
          <div className="EmpPageWrapper">
              <div>
          <div className="text-align margin_bottom"><h1>{this.props.name}</h1></div>
          {/* <GoogleLogout
           clientId="785790539959-ea8fvttmkdin1kg307dlmg4pr1ekdmqg.apps.googleusercontent.com"
           buttonText="Logout"
           onLogoutSuccess={logout}
           >
           </GoogleLogout> */}
           </div>
          <div className="text-align margin_bottom">{this.state.currentDate}</div>
          <div className="button_wrapper ">
          <ButtonGroup variant="contained" color="primary" ref={this.state.anchorRef} aria-label="split button" className="margin-right">
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
                  {options.map((option, index) => (
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
        <Button variant="contained" color="secondary" onClick={this.handleSubmit}  className="margin-left">
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

export default EmployeePage;