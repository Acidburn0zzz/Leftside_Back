/*! Leftside Back v1.3.3 | (c) Philipp König under GPL-3.0 */
"use strict";!function(){var a=function(a,b){chrome.tabs.query({active:!0,currentWindow:!0},function(a){chrome.tabs.remove(a[0].id)})},b={closeTab:a};chrome.extension.onMessage.addListener(function(a,c,d){return b[a.type]&&b[a.type](a,d),!0})}();