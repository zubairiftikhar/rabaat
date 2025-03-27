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

                            <div class="mobile_app_btn" type="button">
                                <div class="button-wrapper">
                                    <div class="mobile_app_btn_text">Download it now</div>
                                    <span class="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                                    </span>
                                </div>
                            </div>
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