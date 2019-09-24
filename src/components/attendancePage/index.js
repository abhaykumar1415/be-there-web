import React, { Component } from 'react';


class AttendancePage extends Component{
    constructor(props){
        super(props);
        this.state={
            currentDate:'',
        }
    }

   

    componentDidMount() 
    { 
        this.setState({redirect:true});
        let date=new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
        this.setState({currentDate:date});
    }   
    render(){
        return(
            <div className="pageWrapper">
                <div>{this.props.empName}</div>
                <div>{this.state.currentDate}</div>
                <div>Attendance Marked</div>
            </div>
        )
    }
    
}

export default AttendancePage;