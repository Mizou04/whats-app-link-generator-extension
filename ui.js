const OPTIONS_LINK = document.querySelector('#options');

OPTIONS_LINK.addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('config.html'));
  }
});

