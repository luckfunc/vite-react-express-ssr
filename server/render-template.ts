// server/render-template.ts
interface IRenderTemplateProps {
  appHtml: string;
  clientScript: string;
  title?: string;
}
export function renderTemplate(props: IRenderTemplateProps) {
  const { appHtml, clientScript, title = 'My Vite SSR App' } = props;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="This is a default description for all pages">
    <meta name="keywords" content="SSR, Vite, React, TypeScript">
    <meta name="author" content="Your Name">
    <title>${title}</title>
  </head>

  <body>
      <div id="app">${appHtml}</div>
      <script type="module" src="${clientScript}"></script>
  </body>
  </html>
`;
}
