import './style.less';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="card">
        <h1>Contact Us</h1>
        <p>Have a question or want to work together? Feel free to reach out.</p>
        <div className="contact-info">
          <div className="info-item">
            <strong>Email:</strong> <a href="mailto:hello@example.com">hello@example.com</a>
          </div>
          <div className="info-item">
            <strong>Phone:</strong> <span>+1 (234) 567-890</span>
          </div>
        </div>
        <a href="/" className="home-link">Go back to Home</a>
      </div>
    </div>
  );
}