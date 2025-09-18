// Popup script for CORS disabler extension
document.addEventListener('DOMContentLoaded', function() {
  const statusDiv = document.getElementById('status');
  const toggleBtn = document.getElementById('toggle');
  
  // Check current status
  chrome.storage.sync.get(['corsDisabled'], function(result) {
    const isDisabled = result.corsDisabled || false;
    updateUI(isDisabled);
  });
  
  // Toggle CORS disabling
  toggleBtn.addEventListener('click', function() {
    chrome.storage.sync.get(['corsDisabled'], function(result) {
      const newStatus = !result.corsDisabled;
      chrome.storage.sync.set({ corsDisabled: newStatus }, function() {
        updateUI(newStatus);
      });
    });
  });
  
  function updateUI(isDisabled) {
    if (isDisabled) {
      statusDiv.textContent = 'CORS Disabling: ENABLED';
      statusDiv.className = 'status enabled';
      toggleBtn.textContent = 'Disable CORS Disabling';
      toggleBtn.className = 'disable-btn';
    } else {
      statusDiv.textContent = 'CORS Disabling: DISABLED';
      statusDiv.className = 'status disabled';
      toggleBtn.textContent = 'Enable CORS Disabling';
      toggleBtn.className = 'enable-btn';
    }
  }
});