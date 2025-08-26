import React from 'react';

interface HomeProps {
  data?: string | null;
}

const Home: React.FC<HomeProps> = ({ data }) => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the SSR demo with Express, Vite and TSX!</p>
      {data && <p>Data from API: {data}</p>}
      <a href="/about">Go to About</a>
    </div>
  );
};

export default Home;
