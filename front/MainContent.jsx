import React, { useEffect, useState } from "react";

const MainContent  = () => {
return (
<div className="row justify-content-center">
          <div className="col-3">
            <img src="src/img/CAT-110.png" width="200" />
          </div>
          <div className="col-7">
            <div className="h1">👋 Hey there!</div>

            <div className="">
              I am Dinechko and Im working on awesome contracts so that's pretty cool right? Connect your Ethereum wallet (only Rinkeby network)
              and wave at me!
            </div>
            
            <div className="mt-4">
              <em>
                You have a chance to win some ether! So check your balance after
                waving me.
              </em>
            </div>
          </div>
        </div>
  
);
  
}


export default MainContent;