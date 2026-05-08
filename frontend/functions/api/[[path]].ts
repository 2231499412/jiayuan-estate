// Proxy all /api/* requests to the backend Worker
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = `https://jiayuan-estate-api.2231499412.workers.dev${url.pathname}${url.search}`;
  
  const newRequest = new Request(targetUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
  });
  
  return fetch(newRequest);
};
