import { useEffect } from 'react';
import { PageProps, HomeProps } from '@types';
import './style.less';

export default function App(props: PageProps<HomeProps>) {
  const { data } = props;
  console.log('data', data);
  useEffect(() => {
    console.log('data', data);
    console.log('哈哈');
  }, []);

  return (
    <div className="home-page">
      <h1>{data?.title}</h1>
      <p>Welcome to the SSR demo with Express, Vite and TSX!</p>
      <a href="/about">Go to About</a>
    </div>
  );
}
