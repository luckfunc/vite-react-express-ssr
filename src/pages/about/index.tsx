import { PageProps, AboutProps } from '@types';

export default function About(props: PageProps<AboutProps>) {
  const { data } = props;

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
    </div>
  );
}
