// ==UserScript==
// @name         Dicke Burger Sammlung
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Gunnar aka the curler
// @match        http://bs.to/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';
//
//global vars
var gTimeout;
const gInfo = "***Info***\n - Dies ist ein Script um Serien zu speichern und weiter zu gucken.\n\tVideos laden automatisch zur nächsten Folge.\n\tDieses Script funktioniert nur unter \"bs.to\" und mit dem Vivo-Player.\n\n"
                   + "**Buttons Funktionen**\n\n*Info*\n - Gibt die Infos aus.\n\n"
                   + "*Speichern*\n - Speichert die Folge im Cookie.\n\tDa dies per URL geschied, muss man auf einer Folge sein.\n\n"
                   + "*Weiter Gucken*\n - Läd die nächste Folge.\n\tDa er die Folge aus dem Cookie läd, muss einer gespeichert sein.\n\tDanach wird die nächste Folge in dem Cookie gespeichert.\n\n"
                   + "*Löschen*\n - Löscht den Cookie.\n\tGeht nur, wenn ein Cookie gespeichert ist.\n\n"
                   + "*Stop*\n - Stoppt den Autoplay.\n\tZwischen den Videos hat man 6-Sekunden, um auf den Button zu klicken.\n\tDanach kann man, mit dem \"weiter gucken\" - Button, die nächste Folge wie gewohnt abspielen.\n\n"
                   + "Viel Spaß und immer harte Curls, Gunnar\n\n"
                   + "Deine Serie ist gerade: " + get_cookie ("continue");
//
//class button
function button (value, x, y, click, can)
{
    var input = document.createElement ("input");
    if (can ())
    {
        input.style.cursor = "pointer";
        input.onmouseover = function (){ input.style.backgroundColor = "#0066FF"; input.style.color = "black"; input.style.border = "2px solid #0066FF";};
        input.onmouseout = function (){ input.style.backgroundColor = "green"; input.style.color = "white"; input.style.border = "2px solid green";};
        input.onclick = click;
    }
    else
    {
        input.style.opacity = "0.6";
        input.style.cursor = "not-allowed";
    }
    input.style.fontSize = "22px";
    input.style.position = "fixed";
    input.style.top = x;
    input.style.left = y;
    input.style.backgroundColor = "green";
    input.style.border = "2px solid green";
    input.style.color = "white";
    input.style.padding = "10px 22px";
    input.style.textAlign = "center";
    input.style.zIndex = "9999999";
    input.type = "button";
    input.value = value;
    input.style.transitionDuration = "0.4s";
    document.body.appendChild (input);
}
//
//buttons
var info_button = new button ("info", "5px", "5px", function (){ alert (gInfo);}, function (){ return 1;});
var safe_button = new button ("speichern", "60px", "5px", function (){ if (confirm ("Speichern?")){ save (); location.reload ();}}, function (){ if (is_valid (location.href)) return 1;});
var next_button = new button ("weiter gucken", "115px", "5px", function (){ if (confirm ("Weiter gucken?")) next ();}, function (){ if (get_cookie ("continue")) return 1;});
var delete_button = new button ("löschen", "170px", "5px", function (){ if (confirm ("Löschen?")){ del_cookie ("continue"); location.assign (location.origin);}}, function (){ if (get_cookie ("continue")) return 1;});
var stop_button =  new button ("stop", "225px", "5px", function (){ if (confirm ("Stop")){ clearTimeout (gTimeout); location.assign (location.origin);}}, function (){ if (location.search == "?next") return 1;});
//
//forever
window.onload = forever ();
//
//forever
function forever ()
{
    if (get_cookie ("continue") == "end" && ! (location.pathname.match ("/Vivo-1")))
    {
        del_cookie ("continue");
        alert( "Serie zu Ende" );
        location.assign (location.origin);
    }
    else if (location.pathname.match ("/Vivo-1") && location.search == "?next")
        location.assign (document.getElementById ("video_actions").firstElementChild.firstElementChild);
    else if (location.search == "?next")
        gTimeout = window.setTimeout (function (){ next ();}, 3000);
}
//
//delete cookie
function del_cookie (cname)
{
    if (get_cookie (cname))
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
//
//set cookie
function set_cookie (cname, cvalue, exdays)
{
    var d = new Date () ;
    d.setTime (d.getTime () + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString ();
    if (get_cookie (cname))
       del_cookie (cname);
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
//
//get cookie
function get_cookie (cname)
{
    var name = cname + "=";
    var ca = document.cookie.split (';');
    for (var i = 0; i < ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt (0) == ' ')
            c = c.substring( 1);
        if (c.indexOf (name) == 0)
            return c.substring (name.length, c.length);
    }
    return;
}
//
//play next episode
function next ()
{
    var url = get_cookie ("continue");
    if (! (location.pathname.match ("/serie/")))
        location.assign (url.slice (0, url.indexOf ("/Vivo-1")) + "?next");
    var next_ep = get_next_ep ();
    set_cookie ("continue", next_ep, 50);
    location.assign (url);
}
//
//get next episode
function get_next_ep ()
{
    var div = document.getElementById ("sp_left");
    var ul_ep = div.getElementsByTagName ("ul")[1];
    //is next ep
    var li_ep_size = ul_ep.getElementsByTagName ("li").length;
    var this_ep = 0;
    for (var i = 0; i < li_ep_size; i++)
    {
        var li_ep = ul_ep.getElementsByTagName ("li")[i];
        if (li_ep.hasAttribute ("class"))
        {
            this_ep = i+1;
            break;
        }
    }
    if (this_ep < li_ep_size)
    {
        var li_ep = ul_ep.getElementsByTagName ("li")[this_ep];
        var new_url = li_ep.getElementsByTagName ("a")[0].getAttribute ("href");
        new_url = "http://www.bs.to/" + new_url + "/Vivo-1?next";
        return new_url;
    }
    //is next ep
    else
    {
        var ul_relay = div.getElementsByTagName ("ul")[0];
        var li_relay_size = ul_relay.getElementsByTagName ("li").length;
        var this_relay = 0;
        for (var i = 1; i < (li_relay_size - 1); i++)
        {
            var li_relay = ul_relay.getElementsByTagName ("li")[i];
            if (li_relay.getAttribute ("class") == " current")
            {
                this_relay = i+1;
                break;
            }
        }
        if (this_relay < (li_relay_size - 1))
        {
            var li_relay = ul_relay.getElementsByTagName ("li")[this_relay];
            var new_url = li_relay.getElementsByTagName ("a")[0].getAttribute ("href");
            new_url = "http://www.bs.to/" + new_url + "/1-A/Vivo-1?next";
            return new_url;
        }
    }
    //serie end
    return "end";
}
//
//save location.href in cookie
function save ()
{
    var url = location.href;
    if (! (url = is_valid (url)))
        return;
    set_cookie ("continue", url , 50);
}
//
//is given url valid to save
function is_valid (url)
{
    var size = 0;
    for (var i = 0; i < url.length; i++)
    {
        if (url[i] == "/")
            size++;
    }
    if (url.match ("/serie/") && size == 6)
        return url + "/Vivo-1?next";
    return;
}
