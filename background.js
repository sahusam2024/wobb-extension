let popupWindowId = null;
let instagramURL = "";

function getInstagramPageType(url) {
  const instagramProfilePattern = /^https:\/\/www\.instagram\.com\/[^\/]+\/?$/;
  const instagramUrlPattern = /^https:\/\/www\.instagram\.com\/.*$/;

  if (instagramProfilePattern.test(url)) {
    return 'profile';
  } else if (instagramUrlPattern.test(url)) {
    return 'instagramPage';
  } else {
    return 'other';
  }
}

function getCurrentTabUrl() {
  return new Promise((resolve, reject) => {
    const queryInfo = { active: true, currentWindow: true };
    const api = typeof browser !== "undefined" ? browser : chrome;
    if (api.tabs && api.tabs.query.length === 1) {
      api.tabs
        .query(queryInfo)
        .then((tabs) => resolve(tabs[0].url))
        .catch((error) => reject(error));
    } else {
      api.tabs.query(queryInfo, (tabs) => {
        if (api.runtime.lastError) {
          reject(api.runtime.lastError);
        } else {
          resolve(tabs[0].url);
        }
      });
    }
  });
}

function getSocialNameFromLink(link) {
  try {
    let socialName = "";
    if (typeof link === "string") {
      if (link.includes(".com")) {
        let array = link.split("/");
        array.forEach((el, index) => {
          if (el.includes(".com")) {
            socialName = array[index + 1].split("?")[0];
          }
        });
      } else if (link.includes("@")) {
        socialName = link.replace("@", "");
      } else {
        socialName = link;
      }

      socialName = socialName.toLowerCase();
      return socialName;
    } else {
      return "invalidSocialName";
    }
  } catch (e) {
    return "invalidSocialName";
  }
}

function createPopup() {
  chrome.windows.getCurrent(function (currentWindow) {
    const width = Math.round(currentWindow.width * 0.4);
    const height = currentWindow.height - 100;
    const left = currentWindow.width - width;
    const top = 90;
    getCurrentTabUrl().then(async (currentUrl) => {
      const urlOfType = getInstagramPageType(currentUrl);
      if (urlOfType === "other" || urlOfType === "instagramPage") {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            return window.messageScriptLoaded || false;
          },
        });

        if (tab.id !== undefined) {
          if (!result.result) {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: [urlOfType === "other" ? "message.js" : "instamessage.js"],
            });
          }
        }
        return;
      }

      if (!popupWindowId) {
        chrome.windows.create(
          {
            url: `https://stage.wobb.ai/app/discover/no-auth?username=${getSocialNameFromLink(currentUrl)}&platform=instagram`,
            type: "popup",
            width: width,
            height: height,
            left: left,
            top: top,
            focused: true,
          },
          function (newWindow) {
            popupWindowId = newWindow.id;
          }
        );
      }
    });
  });
}

function focusOrCreatePopup() {
  if (popupWindowId) {
    chrome.windows.get(popupWindowId, function (window) {
      if (chrome.runtime.lastError) {
        createPopup();
      } else {
        chrome.windows.update(popupWindowId, { focused: true });
      }
    });
  } else {
    createPopup();
  }
}

chrome.action.onClicked.addListener(function () {
  if (popupWindowId !== null) {
    chrome.windows.get(popupWindowId, (window) => {
      if (chrome.runtime.lastError) {
        popupWindowId = null;
        createPopup();
      } else {
        if (window.state === "minimized") {
          chrome.windows.update(popupWindowId, { state: "normal" });
        } else {
          chrome.windows.update(popupWindowId, { focused: true });
        }
      }
    });
  } else {
    createPopup();
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
    const newUrl = tab.url;
    const changeUrl = `https://stage.wobb.ai/app/discover/no-auth?username=${getSocialNameFromLink(newUrl)}&platform=instagram`;

    if (popupWindowId !== null && newUrl && getSocialNameFromLink(newUrl) !== 'invalidSocialName') {
      chrome.tabs.query({ windowId: popupWindowId }, function (tabs) {
        if (tabs.length > 0) {
          if (changeUrl !== instagramURL) {
            chrome.tabs.update(tabs[0].id, { url: changeUrl });
            instagramURL = changeUrl;
            chrome.windows.update(popupWindowId, { focused: true });
          }
        }
      });
    }
  }
});
