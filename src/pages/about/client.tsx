import React from 'react';
import { hydrateRoot } from 'react-dom/client';

// Since the component is defined on the server, we just re-export it here
// for the client build. In a real app, you might share this component
// from a common library.
function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a new page created to demonstrate the template's functionality.</p>
      <a href="/">Go back to Home</a>
    </div>
  );
}

hydrateRoot(document.getElementById('root')!, <About />);
