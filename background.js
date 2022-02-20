// stores time spent at domains at a set interval
// TODO: add date in order to group data
// TODO: improve data storing, now everything is overwritten
// TODO: interval might increase more than it should, check for double reg of func

chrome.runtime.onInstalled.addListener(()=>{
  chrome.storage.sync.set({domainTimeUsage: []});
  // [{domain [string], time [seconds]}]
});

let domainTimeUsage = [];
chrome.storage.sync.get("domainTimeUsage", (data) => {
  domainTimeUsage = data.domainTimeUsage;
});

let interval = 2000;

chrome.windows.onRemoved.addListener(() =>{
  // store data in storage
    chrome.storage.sync.set({domainTimeUsage: domainTimeUsage});
    console.log("Data has been stored")
});

setInterval(checkDomainUsage, interval);

function checkDomainUsage(){
  // all active tabs
  chrome.tabs.query({active:true},(tabs) => {
    tabs.forEach((tab) => {
      addTimeToDomain(tab);
    });
  });
  // non active tabs making sound
  chrome.tabs.query({active:false, audible:true, muted:false},(tabs) => {
    tabs.forEach((tab) => {
      addTimeToDomain(tab);
    });
  });
}

function addTimeToDomain(tabInfo){
    let curDomain = getDomainName(tabInfo.url);
    let index = domainTimeUsage.findIndex(({domain}) => domain == curDomain);
    console.log(index)
    if (index == -1){
      domainTimeUsage.push({"domain":curDomain, "time":interval});
    }else{
      console.log(domainTimeUsage)
      domainTimeUsage[index].time+=interval;
    }
}

function getDomainName(url){
  let start = url.indexOf("//") + 2;
  let end = url.indexOf("/",start);
  return url.slice(start,end)
}
