function replaceLogo() {
  const currentLogo =
    document.querySelector("img#hplogo") ??
    document.querySelector('img[alt="Google"]') ??
    document.querySelector('a[aria-label="Go to Google Home"] > svg');

  if (!currentLogo) {
    console.error(
      "[Bounce for Google] Failed to find the Google logo to replace."
    );
    return;
  }

  const currentStyle = window.getComputedStyle(currentLogo);

  const bouncingLogoContainer = document.createElement("div");
  bouncingLogoContainer.id = "hplogo";
  bouncingLogoContainer.style.paddingTop = currentStyle.paddingTop;
  bouncingLogoContainer.style.width = currentStyle.width;
  bouncingLogoContainer.style.height = currentStyle.height + "";
  currentLogo.parentNode.appendChild(bouncingLogoContainer);
  currentLogo.parentNode.removeChild(currentLogo);

  const bouncingLogo = document.createElement("div");
  bouncingLogo.id =
    window.location.pathname === "/search" ? "bouncing-2" : "bouncing-1";
  bouncingLogo.classList.add("google-bouncing-logo");
  bouncingLogo.style.height = currentStyle.height;
  bouncingLogoContainer.appendChild(bouncingLogo);
  "Google".split("").forEach(function (letter) {
    i = document.createElement("i");
    i.textContent = letter;
    bouncingLogo.appendChild(i);
  });

  setTimeout(() => bouncingLogo.classList.add("visible"), 10);
}

function parse(config, value, defaultValue, reverse) {
  let current = config;
  value = value.split(".");
  value.some(function (property) {
    current = current[property];
    if (typeof current === "undefined") {
      current = defaultValue;
    }
    if (current === null) {
      return true;
    }
  });
  if (reverse && current !== null) {
    current = 0 - current;
  }
  return current;
}

function generateStyle(data) {
  let tag = document.querySelector("#google-bouncing-logo-style");
  if (!tag) {
    tag = document.createElement("style");
    tag.id = "google-bouncing-logo-style";
    document.head.appendChild(tag);
  }

  data = {
    translatexinitial: parse(data, "translatexinitial", 0),
    translateyinitial: parse(data, "translateyinitial", 0),
    scaleinitial: parse(data, "scaleinitial", 1),
    translatexfinal: parse(data, "translatexfinal", 0),
    translateyfinal: parse(data, "translateyfinal", -100),
    scalefinal: parse(data, "scalefinal", 1.1),
  };

  const style =
    "@keyframes bounce-google-logo { 0% { transform: translate3d(translatexinitial, translateyinitial, 0) scale(scaleinitial); text-shadow: rgba(0, 0, 0, 0.35) 0 translateyinitialinverse 0.02222em; } 100% { transform: translate3d(translatexfinal, translateyfinal, 0) scale(scalefinal); text-shadow: rgba(0, 0, 0, 0.35) 0 translateyfinalinverse 0.2em; z-index: 999; } }"
      .replace(/translatexinitial/g, data.translatexinitial + "px")
      .replace(/translateyinitialinverse/g, 0 - data.translateyinitial + "px")
      .replace(/translateyinitial/g, data.translateyinitial + "px")
      .replace(/scaleinitial/g, data.scaleinitial)
      .replace(/translatexfinal/g, data.translatexfinal + "px")
      .replace(/translateyfinalinverse/g, 0 - data.translateyfinal + "px")
      .replace(/translateyfinal/g, data.translateyfinal + "px")
      .replace(/scalefinal/g, data.scalefinal);
  tag.innerHTML = style;
  return style;
}

function configure(configuration) {
  const data = {
    translatexinitial: parse(configuration, "initial.x", null),
    translateyinitial: parse(configuration, "initial.y", null, true),
    scaleinitial: parse(configuration, "initial.scale", null),
    translatexfinal: parse(configuration, "final.x", null),
    translateyfinal: parse(configuration, "final.y", null, true),
    scalefinal: parse(configuration, "final.scale", null),
  };
  generateStyle(data);
}

const configuration = {
  initial: {
    x: 0,
    y: 0,
    scale: 1,
  },
  final: {
    x: 0,
    y: window.location.pathname === "/search" ? 30 : 100,
    scale: 1.1,
  },
};

try {
  configure(configuration);
  replaceLogo();
} catch (error) {
  console.error("[Bounce for Google] Failed to load. Error:");
  throw error;
}

/*

TO GET DOMAIN LIST READY FOR MANIFEST

1- Open https://en.wikipedia.org/wiki/List_of_Google_domains

2- Execute this on console:

const table = document.querySelector("#mw-content-text > table:nth-child(8)");
const body = table.querySelector("tbody");
const domains = [];
const domain;
[].forEach.call(body.children, function(tr){
    domain = tr.querySelector("td:nth-child(3) a").href
        .replace("http", "*")
        .replace("://google", "://www.google") + "*";
    domains.push(domain);
});
console.log(JSON.stringify(domains).replace(/,/g, ",\n"));

3- Copy the result into content_scripts.matches in manifest.json

 */
