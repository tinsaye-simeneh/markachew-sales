// Background script for CORS disabler extension
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    // Add CORS headers to all requests
    details.requestHeaders.push({
      name: 'Access-Control-Allow-Origin',
      value: '*'
    });
    details.requestHeaders.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, OPTIONS'
    });
    details.requestHeaders.push({
      name: 'Access-Control-Allow-Headers',
      value: 'Content-Type, Authorization'
    });
    
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    // Add CORS headers to all responses
    details.responseHeaders.push({
      name: 'Access-Control-Allow-Origin',
      value: '*'
    });
    details.responseHeaders.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, OPTIONS'
    });
    details.responseHeaders.push({
      name: 'Access-Control-Allow-Headers',
      value: 'Content-Type, Authorization'
    });
    
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);