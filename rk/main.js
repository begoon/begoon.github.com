// Part of Radio-86RK in JavaScript based on I8080/JS
//
// Copyright (C) 2012 Alexander Demin <alexander@demin.ws>
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2, or (at your option)
// any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.

// These two variables have to be global
var ui, screen;

function IO() {
  this.input = function(port) { return 0; }
  this.output = function(port, w8) {}
  this.interrupt = function(iff) {}
}

function Autoexec() {
  var url = window.location.href;
  this.file = (match = url.match(/file=([^&]+)/)) ? match[1] : null;
  this.loadonly = (match = url.match(/loadonly=([^&]+)/)) ? match[1] : null;
}

function main() {
  var keyboard = new Keyboard();
  var memory = new Memory(keyboard);
  var io = new IO();

  var cpu = new I8080(memory, io);
  var runner = new Runner(cpu);

  ui = new UI(tape_catalog(), runner, memory, new Autoexec());
  screen = new Screen(rk86_font_image(), ui, memory);

  document.getElementById("loading").style.display = "none";
  document.getElementById("main_panel").style.display = "block";
}
