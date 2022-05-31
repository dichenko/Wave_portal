import React, { useEffect, useState } from "react";

const Header = (props) => {
  if (props.status){
return (
  <header className="
    d-flex
    align-items-right
    pb-3 
    mb-5 
    border-bottom 
    text-muted
    fs-6 
    text">
          <div className="circle mr-6" ></div>
          Connected: {props.addr}
    
    </header>);
  
} else{
return (
  <header className="
    d-flex
    align-items-right
    pb-3 
    mb-5 
    border-bottom 
    text-muted
    fs-6 
    text">
          
          Please, connect your wallet
    
    </header>);
    
}



}

export default Header;