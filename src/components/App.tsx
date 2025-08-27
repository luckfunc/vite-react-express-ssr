import React from 'react';

interface AppProps {
  page: React.ReactNode;
}

export default function App({ page }: AppProps) {
  return (
    <div>
      <nav>
        <a href="/">Home</a> | <a href="/about">About</a> | <a href="/contact">Contact</a>
      </nav>
      <hr />
      {page}
    </div>
  );
}
