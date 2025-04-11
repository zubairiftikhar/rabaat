import React, { useEffect } from "react";

const terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <>
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="termofuse">
            <h1 className="first_main_heading text-center py-4">Term of Use</h1>
            <p><strong>1.</strong> Acceptance of Terms Welcome to Rabaat, By accessing or using our services, you agree to abide by these Terms of Use. Rabaat provides information on brand discount programs, bank card offers, and exclusive deals in Pakistan. Our platform connects users with merchants offering special discounts on various products and services. By using our platform, you acknowledge that you have read, understood, and agreed to comply with these terms. </p>
            <ul>
              <li><strong>Policy Updates:</strong> We can change these terms at any time. Continued use after changes constitutes acceptance of the updated terms. </li>
              <li><strong>Legal Compliance:</strong> If any modifications are deemed unenforceable by a court, they will apply moving forward only. </li>
            </ul>
            <p><strong>2.</strong> User Responsibilities and Limitations Rabaat strives to make sure to provide accurate and up-to-date information but does not guarantee the accuracy of all listed discounts, offers, or deals. </p>
            <p><strong>Important Notices for Users:</strong></p>
            <ul>
              <li><strong>Bank Card Discounts:</strong> We connect users with merchants offering exclusive discounts for bank cardholders. However, we do not control the acceptance or rejection of these discounts by third-party merchants.</li>
              <li><strong>Third-Party Offers:</strong> Third-Party Offers: Rabaat is not responsible for the acceptance or rejection of deals, or discount offers by third-party merchants. </li>
              <li><strong>Accuracy & Errors:</strong> While we aim to provide correct details on pricing, discounts, and offers, occasional errors may occur. </li>
              <li><strong>No Direct Affiliation:</strong> Rabaat is not directly affiliated with external websites linked on our platform and does not endorse or control their content or policies. </li>
              <li><strong>Independent Research:</strong> Independent Research: Users should review third-party terms separately before engaging with external websites. </li>
            </ul>
            <p><strong>3.</strong> Intellectual Property and Usage Rights All logos, trademarks, brand names, designs, and content displayed on Rabaat belong to Rabaat or its legal licensors. Unauthorized use is strictly prohibited.          </p>
            <ul>
              <li>Third-Party Trademarks: Any third-party logos or trademarks visible on our platform belong to their respective owners.</li>
              <li>Content Protection: Unauthorized duplication, modification, or distribution of text, images, software, or design elements is a violation of our proprietary rights.      </li>
              <li>Legal Action: Rabaat reserves the right to pursue legal action, including injunctive relief, against individuals or entities misusing our intellectual property.</li>
            </ul>
            <p><strong>4.</strong> Disclaimers and Limitations of Liability Rabaat provides its services “as is” and “as available” without guarantees of uninterrupted access or technical accuracy.  </p>
            <p><strong>We do not warrant that:</strong></p>
            <ul>
              <li>Our services will function without errors or disruptions.             </li>
              <li>Third-party offers and deals, including bank card discounts, will always be honored. </li>
              <li>All pricing, discount, or promotional information will be up-to-date. </li>
            </ul>
            <p><strong>We are not liable for losses, or inconveniences caused by: </strong></p>
            <ul>
              <li>Errors in discounts or content. </li>
              <li>Service interruptions, cyberattacks, or technical failures</li>
              <li>User interactions with third-party merchants.</li>
            </ul>
            <p><strong>5.</strong> Legal Disputes & Governing Law Rabaat Terms of Use are governed by the laws of Pakistan.</p>
            <ul>
              <p><strong>Dispute Resolution</strong></p>
              <ul>
                <li>Any disputes related to our services will be resolved through confidential arbitration in Pakistan.  </li>
              </ul>
            </ul>
            <ul>
              <p><strong>Intellectual Property Violations:</strong></p>
              <ul>
                <li>If a user violates our intellectual property rights, we may seek legal action in a court of law.                 </li>
              </ul>
            </ul>
            <p><strong>6.</strong> Stay Updated We encourage users to regularly review these terms to stay informed about any changes.</p>
          </div>
        </div>
      </div>
    </div>
    <div className="about_gradient">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h5 style={{color: "#fff"}}>Rabaat</h5>
          <p style={{color: "#fff", textAlign: "center"}}>Your Trusted Source for the Latest Bank Card Discounts and Exclusive Brand Deal Offers in Pakistan!</p>
        </div>
      </div>
    </div>
    </div>
  </>;
};

export default terms;
