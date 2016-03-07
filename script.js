"use strict";
var i, logo, logo2, divlogo, logostyle, div, div2;

try {
    logo = document.querySelector("#hplogo");
    if (logo.tagName.toLowerCase() === "img") {
        divlogo = document.createElement("div");
        divlogo.id = "hplogo";
        logostyle = window.getComputedStyle(logo);
        divlogo.style.paddingTop = logostyle.paddingTop;
        divlogo.style.width = logostyle.width;
        divlogo.style.height = logostyle = logostyle.height + "";
        logo.parentNode.appendChild(divlogo);
        logo.parentNode.removeChild(logo);
        logo = divlogo;
    }
    div = document.createElement("div");
    div.id = "bouncing-1";
    div.classList.add("google-bouncing-logo");
    div.style.height = logostyle;
    logo.appendChild(div);
    "Google".split("").forEach(function(letter) {
        i = document.createElement("i");
        i.textContent = letter;
        div.appendChild(i);
    });
} catch (e) {}

logo2 = document.querySelector("#logo");
div2 = document.createElement("div");
div2.id = "bouncing-2";
div2.classList.add("google-bouncing-logo", "bouncing");
logo2.appendChild(div2);
"Google".split("").forEach(function(letter) {
    i = document.createElement("i");
    i.textContent = letter;
    div2.appendChild(i);
});
if (document.readyState === "complete") {
    setTimeout(function() {
        div.classList.add("bouncing");
    }, 500);
} else {
    window.addEventListener("load", function() {
        div.classList.add("bouncing");
    });
}

function parse(config, value, defaultValue, reverse) {
    var current = config;
    value = value.split(".");
    value.some(function(property) {
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
    var tag = document.querySelector("#google-bouncing-logo-style");
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
        scalefinal: parse(data, "scalefinal", 1.1)
    };

    var style = "@keyframes bounce-google-logo { 0% { transform: translate3d(translatexinitial, translateyinitial, 0) scale(scaleinitial); text-shadow: rgba(0, 0, 0, 0.35) 0 translateyinitialinverse 0.02222em; } 100% { transform: translate3d(translatexfinal, translateyfinal, 0) scale(scalefinal); text-shadow: rgba(0, 0, 0, 0.35) 0 translateyfinalinverse 0.2em; z-index: 999; } }"
        .replace(/translatexinitial/g, data.translatexinitial + "px")
        .replace(/translateyinitialinverse/g, (0 - data.translateyinitial) + "px")
        .replace(/translateyinitial/g, data.translateyinitial + "px")
        .replace(/scaleinitial/g, data.scaleinitial)
        .replace(/translatexfinal/g, data.translatexfinal + "px")
        .replace(/translateyfinalinverse/g, (0 - data.translateyfinal) + "px")
        .replace(/translateyfinal/g, data.translateyfinal + "px")
        .replace(/scalefinal/g, data.scalefinal);
    tag.innerHTML = style;
    return style;
}

function configure(configuration) {
    var data = {
        translatexinitial: parse(configuration, "initial.x", null),
        translateyinitial: parse(configuration, "initial.y", null, true),
        scaleinitial: parse(configuration, "initial.scale", null),
        translatexfinal: parse(configuration, "final.x", null),
        translateyfinal: parse(configuration, "final.y", null, true),
        scalefinal: parse(configuration, "final.scale", null)
    };
    generateStyle(data);
}

var configuration = {
    initial: {
        x: 0,
        y: 0,
        scale: 1
    },
    final: {
        x: 0,
        y: 100,
        scale: 1.1
    }
};

configure(configuration);


/*

TO GET DOMAIN LIST READY FOR MANIFEST

1- Open https://en.wikipedia.org/wiki/List_of_Google_domains

2- Execute this on console:

var table = document.querySelector("#mw-content-text > table:nth-child(8)");
var body = table.querySelector("tbody");
var domains = [];
var domain;
[].forEach.call(body.children, function(tr){
    domain = tr.querySelector("td:nth-child(3) a").href
        .replace("http", "*")
        .replace("://google", "://www.google") + "*";
    domains.push(domain);
});
console.log(JSON.stringify(domains).replace(/,/g, ",\n"));

3- Copy the result into content_scripts.matches in manifest.json

4- Beautify manifest.json

 */
