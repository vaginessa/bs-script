// ==UserScript==
// @name         Dicke Burger Sammlung 2
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Gunnar aka the curler
// @match        https://vivo.sx/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

//
//forever play vid
window.onload = play ();

//
//play vid
function play ()
{
    window.setTimeout (function (){ location.assign (document.getElementsByClassName ("stream-content")[0].getAttribute ("data-url"));}, 3000);
}

//
//form submit
document.forms[0].submit ();
