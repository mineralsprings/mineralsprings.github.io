@echo off

:: do js
type js\common-funcs.js js\goo.js js\verbs.js js\writers.js ^
  js\index-helper.js js\forms\edit-menu.js js\forms\edit-order.js ^
  js\viewers\menu.js js\viewers\order.js > js\all_compressed.js