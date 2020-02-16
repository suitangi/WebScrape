function scrape() {
  let config = window.configJson;
  eval(config.functions.scrape.function);
  eval("return " + config.functions.scrape.return);
}

function saveData(data) {
  let config = window.configJson;
  let obj = {};
  obj[config.save_data.data_name] = [];
  chrome.storage.local.get(obj, function(oldData) {
      let newData = oldData.(config.save_data.data_name);
      newData.push(data);
      obj[config.save_data.data_name] = newData;
      chrome.storage.local.set(obj, function(){});
  }
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
  let data = scrape();
  saveData(data);
  if (!eval(config.end_state)) {
    next();
  } else {
    console.log
  }
}

function loadJson(json) {
  window.configJson = json;
}

function init() {

  //loads the json
  const jsonUrl = chrome.runtime.getURL('config.json');
  fetch(jsonUrl)
    .then((response) => response.json())
    .then((json) => loadJson(json));
  let config = window.configJson;

  // if at start state
  if (eval(config.end_state)) {
    chrome.storage.local.set({
      run: false;
    }, function() {
      run();
    });
  } else if (eval(config.start_state)) {
    chrome.storage.local.set({
      run: true;
    }, function() {
      run();
    });
  } else {
    if (window.location.href.includes(config.domain)) {
      chrome.storage.local.get({
          run: false;
        }, function(data) {
          if (data.run) {
            run();
          }
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
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
