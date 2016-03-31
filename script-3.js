// ==UserScript==
// @name         Dicke Burger Sammlung 3
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Gunnar aka the Curler
// @match        *://*/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

//forever get fullscrreen
window.onload = fullscreen ()
function fullscreen ()
{
  if (location.href.match ("vivo.sx"))
  {
    var vid = document.getElementsByTagName ("video")[0];   
    vid.style.height = "100%";
    vid.style.width = "100%";
    window.setInterval (function (){ if (vid.ended) location.assign ("http://www.bs.to/?next");}, 3000);
  }
}
