import './topnav.css'
import { NavLink } from 'react-router-dom'
import React from "react";



function LandingPage() {
    return ( 
        <body className="landing-body">
            <div className="topnav">
            <NavLink to="/login">Log In</NavLink>
            </div>
        </body>
        

        
    )
}   


export default LandingPage;