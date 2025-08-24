import React from 'react';
import type { HomePageProps } from '../../types';

export default function HomePage({ userName = 'Guest' }: HomePageProps) {
  return (
    <div>
      <h1>Hello, {userName}!</h1>
      <p>This is the Home Page, rendered with data from the server.</p>
    </div>
  );
}
