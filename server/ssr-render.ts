import { renderToString } from 'react-dom/server';

export function renderToHtml(page: React.ReactElement): string {
  return renderToString(page);
}
