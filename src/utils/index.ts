import { PageProps } from '@types';

export const getSsrProps = <T>(): PageProps<T> => {
  return window.__SSR_PROPS__ || {};
};
