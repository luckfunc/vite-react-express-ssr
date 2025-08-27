import { PageProps, ContactProps } from '@types';

export default function Contact(props: PageProps<ContactProps>) {
  const { data } = props;

  return (
    <div>
      <h1>Contact Us</h1>
      <p>Email: {data?.email}</p>
      <p>Phone: {data?.phone}</p>
    </div>
  );
}
