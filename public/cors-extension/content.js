// Content script for CORS disabler extension
// This script runs on all pages and can help with CORS issues

// Override fetch to add CORS headers
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const [url, options = {}] = args;
  
  // Add CORS headers to all requests
  const headers = new Headers(options.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return originalFetch(url, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'omit'
  });
};

// Override XMLHttpRequest to add CORS headers
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  this._url = url;
  return originalXHROpen.call(this, method, url, ...args);
};

const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(data) {
  // Add CORS headers
  this.setRequestHeader('Access-Control-Allow-Origin', '*');
  this.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  this.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return originalXHRSend.call(this, data);
};

console.log('CORS Disabler extension loaded');