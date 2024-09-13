import React from 'react';
import './PrivacyPolicyPage.css'; // Import your CSS file

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="title">Privacy Policy</h1>
      <p className="subtitle">Effective Date: [Insert Date]</p>
      <div className="section">
        <h2 className="heading">Introduction</h2>
        <p className="text">
          Welcome to [Your Company Name]. We are committed to protecting your personal information
          and your right to privacy. This Privacy Policy explains how we collect, use, and disclose
          your personal information.
        </p>
      </div>
      <div className="section">
        <h2 className="heading">Information We Collect</h2>
        <p className="text">
          We collect information that you provide to us directly, such as when you create an account,
          make a purchase, or contact customer support. This may include personal details such as
          your name, email address, and payment information.
        </p>
      </div>
      <div className="section">
        <h2 className="heading">How We Use Your Information</h2>
        <p className="text">
          We use the information we collect to process transactions, provide customer support, and
          improve our services. We may also use your information to send you marketing communications
          if you have opted in to receive them.
        </p>
      </div>
      <div className="section">
        <h2 className="heading">How We Share Your Information</h2>
        <p className="text">
          We may share your information with third-party service providers who assist us in operating
          our business, such as payment processors and shipping companies. We do not sell your
          personal information to third parties.
        </p>
      </div>
      <div className="section">
        <h2 className="heading">Your Choices</h2>
        <p className="text">
          You have the right to access, correct, or delete your personal information. You can also
          opt out of receiving marketing communications at any time.
        </p>
      </div>
      <div className="section">
        <h2 className="heading">Changes to This Policy</h2>
        <p className="text">
          We may update this Privacy Policy from time to time. We will notify you of any significant
          changes by posting the new policy on our website.
        </p>
      </div>
      <div className="section">
        <h2 className="heading">Contact Us</h2>
        <p className="text">
          If you have any questions about this Privacy Policy or our practices, please contact us at
          [Your Contact Information].
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
