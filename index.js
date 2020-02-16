
// Olddata is the cumulative data from past iterations
// Write whatever your scraping operation is
// Add to the old data however you see fit and return the newest manipulated data
function scrape(oldData) {

}



// -------------- Don't touch Anything Under ------------- //
function saveData() {
  chrome.storage.local.get({
    scraped_data: []
  }, function(oldData) {
    let newData = scrape(oldData.scraped_data);
    chrome.storage.local.set({
      scraped_data: newData
    }, function() {});
  });
}

function next() {
  let config = window.configJson;
  if (config.functions.next.new_page) {
    eval(config.functions.next.function);
  } else {
    eval(config.functions.next.function);
    setTimeout(function() {
      run()
    }, config.functions.next.pause * 1000);
  }
}

function run() {
  let config = window.configJson;
  saveData();
  if (!eval(config.end_state)) {
    next();
  } else {
    chrome.storage.local.get({
      scraped_data: []
    }, function(data) {
      console.log(data.scraped_data);
    });
  }
}

function loadJson() {
  //loads the json
  const jsonUrl = chrome.runtime.getURL('config.json');
  fetch(jsonUrl)
    .then((response) => response.json())
    .then((json) => init(json));
}

function init(json) {
  window.configJson = json;
  let config = json;

  // if at start state
  if (eval(config.end_state)) {
    chrome.storage.local.set({
      run: false
    }, function() {
      run();
    });
  } else if (eval(config.start_state)) {
    chrome.storage.local.set({
      run: true,
      scraped_data: []
    }, function() {
      run();
    });
  } else {
    if (window.location.href.includes(config.domain)) {
      chrome.storage.local.get({
        run: false
      }, function(data) {
        if (data.run) {
          run();
        }
      });
    }
  }
}

// document ready start
if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  loadJson();
} else {
  document.addEventListener("DOMContentLoaded", loadJson);
}
