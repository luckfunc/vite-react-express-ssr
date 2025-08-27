export interface PageProps<T = {}> {
  data?: T;
}

export interface HomeProps {
}

export interface AboutProps {
  title: string;
  description: string;
}

export interface ContactProps {
  email: string;
  phone: string;
}

declare global {
  interface Window {
    __SSR_PROPS__?: Record<string, any>;
  }
}
