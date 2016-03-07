window.addEventListener("load", init);

function init() {
    checkVersion();
}

function openPopup(url) {
    chrome.tabs.create({
        "url": url
    });
}

function checkVersion() {
    var landingUrl = "http://bounceforgoogle.daniguardiola.me/?installed=true";
    var version = chrome.runtime.getManifest().version;
    var updatedUrl;
    chrome.storage.local.get("versionNumber", function(storage) {
        var versionNumber = storage.versionNumber;
        if (!versionNumber) {
            openPopup(landingUrl);
        } else if (versionNumber !== version) {
            updatedUrl = updatedUrl = "http://bounceforgoogle.daniguardiola.me/#changes?update=true&version=" + version;
            openPopup(updatedUrl);
        }
        chrome.storage.local.set({
            "versionNumber": version
        });
    });

}
