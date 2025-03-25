import React from 'react';
import MobileApp from '../../public/assets/img/landing/mobile_app.png';
import './componentstyle.css';

const Mobileapp = () => {
    return (
        <>
            <div className="container-fluid">
                <div className="row ffaba1">
                    <div className="col-lg-7 col-md-7 col-sm-12 mobile_col7">
                        <div className="mobile_app7">
                            <h2 className='pb-4'>Download Rabaat & Start Saving Today!</h2>
                            <p className='pb-4'>Explore the best discounts on shopping, dining, and travel. Download the Rabaat app now and unlock exclusive bank deals and offers!</p>
                            <button className='mobile_app_btn'>Download it now</button>
                            {/* <div className="mobile_app_btns">
                                <button>Play Store</button>
                            </div> */}
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-12">
                        <div className="mobile_app_img">
                            <img src={MobileApp} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Mobileapp