import './style.less';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="card">
        <h1>About Us</h1>
        <p>
          This is a demonstration of a Server-Side Rendered (SSR) application built with Vite, React, TypeScript, and Express.
        </p>
        <p>
          We are passionate about creating modern, high-performance web applications with a focus on clean design and great user experience.
        </p>
        <a href="/" className="home-link">Go back to Home</a>
      </div>
    </div>
  );
}