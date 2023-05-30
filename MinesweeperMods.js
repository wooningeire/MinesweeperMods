/*
http://htwins.net/minesweeper/
 
The following JavaScript is used in Cary’s “Timed Minesweeper” game. Import this modification document by pasting it into the DevTools Console (F12) on the website ate the URL listed above.
 
To make a bookmarklet from this, paste this into http://hastebin.com.
*/
 
// Modes
 
var counter = .1;
function getShift(){
    var name = getPatternName().toLowerCase();
    
    if (name.indexOf("hex") >= 0) return 0.5;
    else if (name.indexOf("sin") >= 0) {
        counter += 1 / 6120;
        return Math.sin(counter) / 4;
    } else if (name.indexOf("switch") >= 0) {
        counter += 1 / 6120;
        return Math.round((Math.sin(counter) + 1) / 2);
    } else return 0;
}
 
boardSizes.push(
//  [1,1,1,"1 by 1"],
    [5,5,3,"Inexperienced"],
    [40,5,20,"Row"]
);
 
neighborPatterns.push(
    [[-1, -1, 1], [-1, 0, 1], [-1, 1, 1], [0, -1, 1], [0, 1, 1], [1, -1, 1], [1, 0, 1], [1, 1, 1], "Sine"],
    [[-1, -1, 1], [-1, 0, 1], [-1, 1, 1], [0, -1, 1], [0, 1, 1], [1, -1, 1], [1, 0, 1], [1, 1, 1], "Switch"],
    [[-1, 0, 1], [1, 0, 1], [0, 1, 2], [0, 2, 0], [0, -1, 1], "t"]
);
 
var lastFiveTimes = [neighborPatterns.length];
for (var i in neighborPatterns) {
    lastFiveTimes[i] = [boardSizes.length];
    for(var j in boardSizes) {
        lastFiveTimes[i][j] = [-1,-1,-1,-1,-1];
    }
}
 
// Display pattern visual
function replaceInFunc(func, replaceValues) {
    var oldFunc = func.toString();
 
    var replacePair;
    for (var i in replaceValues) {
        replacePair = replaceValues[i];
        oldFunc = oldFunc.replace(replacePair[0], replacePair[1]);
    }
    
    return new Function(oldFunc.substring(oldFunc.indexOf("{") + 1, oldFunc.lastIndexOf("}")));
}
drawButtons = replaceInFunc(drawButtons, [[/\+95/g, "+260"], ["104", "269"]]);
 
// Font
var overpass = document.createElement("link");
overpass.setAttribute("href", "http://overpass-30e2.kxcdn.com/overpass.css");
overpass.setAttribute("rel", "stylesheet");
document.head.appendChild(overpass);
 
var font = "Overpass";
 
function changeFont(func, variation, weight) {
    return replaceInFunc(func, [[/.font \=/g, ".font = 'normal " + variation + " " + weight + " ' +"], [/Arial/g, font]]);
}
 
drawBoard = changeFont(drawBoard, "normal", 600);
drawTimes = changeFont(drawTimes, "small-caps", 600);
drawButtons = changeFont(drawButtons, "normal", 500);
 
// Stylized name input
 
var stylesheet = (function() {
    var element = document.createElement("style");
    document.head.appendChild(element);
    return element.sheet;
})();
 
stylesheet.insertRule("* { font-family: Overpass, Interstate, sans-serif; font-weight: 500; }", 0);
stylesheet.insertRule("#window { background: none; height: 120px; border-radius: 10px; background: transparent; }", 0);
stylesheet.insertRule("#window * { color: #000; }", 0);
stylesheet.insertRule("#name { font-size: 18px; display: block; border: 2px none #fff; background: none; border-bottom: solid; }", 0);
stylesheet.insertRule("input[type='button'] { font-size: 14px; border: none; background: none; transition: background .5s ease; }", 0);
stylesheet.insertRule("input[type='button']:hover { background: rgba(255, 255, 255, .5); }", 0);
 
// Dropdown
var pattern;
var option, oText;
 
c.style.position = "relative";
var o = document.querySelector("#overlay");
 
var patternDropdown = document.createElement("select");
 
patternDropdown.style.cssText =
    "position: absolute;" +
    "top: 100px;" +
    "left: 990px;" +
    "padding: 14px 10px;" +
    "width: 260px;" +
    "font-size: 28px;" +
    "background: " + buttonColor + ";" +
    "outline: 0";
 
document.body.insertBefore(patternDropdown, o);
 
for (var i in neighborPatterns) {
    pattern = neighborPatterns[i];
 
    option = document.createElement("option");
    if (i == Number(localStorage.yourGamePattern)) option.selected = true;
    option.setAttribute("value", i);
    option.style.cssText =
        "background: " + bgColor + ";" +
        "font-size: 20px;" +
        "font-family: " + font + ";";
    oText = document.createTextNode(pattern[pattern.length - 1]);
 
    option.appendChild(oText);
 
    patternDropdown.appendChild(option);
}
 
patternDropdown.onclick = function () { playSound("selectSound"); }
patternDropdown.onchange = function () { initializeBoard(gameDifficulty, patternDropdown.options[patternDropdown.selectedIndex].value); };