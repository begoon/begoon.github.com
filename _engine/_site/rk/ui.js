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

function UI(tape_catalog, runner, memory, autoexec) {

  this.tape_catalog = tape_catalog;
  this.runner = runner;
  this.memory = memory;
  this.autoexec = autoexec;

  this.canvas = document.getElementById("canvas");
  this.panel = document.getElementById("back");

  this.screenshot_name = "rk86-screen";
  this.screenshot_count = 1;

  if (!this.canvas.getContext) {
    alert("Tag <canvas> is not support is the browser")
    return;
  }

  if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {;
    document.getElementById('assembler_frame').style.width = (window.innerWidth - 32) + "px";
    document.getElementById('assembler_frame').style.height = (window.innerHeight - 50) + "px";
  }

  this.file_selector = document.getElementById('file_selector');

  for (var i in this.tape_catalog) {
    var name = this.tape_catalog[i];
    this.file_selector.add(new Option(name, name), null);
  }

  this.resize_screen = function() {
    var width = document.getElementById('screen_width').value;
    var height = document.getElementById('screen_height').value;
    var scale_x = document.getElementById('scale_x').value;
    var scale_y = document.getElementById('scale_y').value;
    screen.set_view(width, height, scale_x, scale_y);
  }

  this.resize_canvas = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    this.panel.width = this.canvas.width + 4;
    this.panel.height = this.canvas.height + 4;
  }

  this.reset = function() {
    this.runner.cpu.memory.keyboard.reset();
    this.runner.cpu.jump(0xf800);
    console.log("Reset");
  }

  this.restart = function() {
    this.runner.cpu.memory.zero_ram();
    this.reset();
    restart_this = this;
    window.setTimeout(function() { restart_this.autorun(); }, 1000);
  }

  this.pause = function() {
    if (!this.runner.pause)
      console.log("Pause at " + this.runner.cpu.pc.toString(16));
    this.runner.pause = !this.runner.pause;
  }

  this.tape_file_name = function(name) {
    return "files/" + name;
  }

  this.load_tape_file = function(name) {
    var load_tape_file_this = this;
    var callback = function(image) {
      load_tape_file_this.file_loaded(name, image);
    }
    GetBinaryFile(this.tape_file_name(name), callback, true);
  }

  this.selected_file_name = function() {
    return this.file_selector.options[this.file_selector.selectedIndex].value;
  }

  this.run_selected = function() {
    this.load_mode = "run";
    this.load_tape_file(this.selected_file_name());
  }

  this.load_selected = function() {
    this.load_mode = "load";
    this.load_tape_file(this.selected_file_name());
  }

  this.disassembler_available = function() {
    return window.frames.disassembler_frame.loaded;
  }

  this.extract_rk86_word = function(v, i) {
    return ((v.charCodeAt(i) & 0xff) << 8) | (v.charCodeAt(i + 1) & 0xff);
  }

  this.parse_rk86_binary = function(name, image) {
    var file = {};
    file.name = name;

    var v = image.Content;

    if (name.match(/\.bin$/)) {
      file.size = v.length;
      file.start = name.match(/^mon/) ? 0x10000 - file.size : 0;
      file.end = file.start + file.size - 1;
      file.image = v;
    } else {
      var i = 0;
      if ((v.charCodeAt(i) & 0xff) == 0xe6) ++i;
      file.start = this.extract_rk86_word(v, i);
      file.end = this.extract_rk86_word(v, i + 2);
      i += 4;
      file.size = file.end - file.start + 1;
      file.image = v.substr(i, file.size);
    }
    file.entry = (name == "PVO.GAM" ? 0x3400 : file.start);
    return file;
  }

  this.autorun = function() {
    if (this.autoexec.file) {
      this.load_mode = this.autoexec.loadonly ? "load" : "run";
      this.load_tape_file(this.autoexec.file);
    }
  }

  this.file_loaded = function(name, binary) {
    if (binary == null) {
      alert("Error loading a file '" + name + "'");
      return;
    }
    var file = this.parse_rk86_binary(name, binary);
    this.memory.load_file(file);

    if (this.disassembler_available()) 
      window.frames.disassembler_frame.i8080disasm.refresh(this.memory);

    if (/^mon.+\.bin$/.exec(file.name) && this.load_mode == "run") {
      this.runner.execute();
      console.log("Monitor started");
      this.restart();
      return;
    }

    this.screenshot_name = file.name;
    this.screenshot_count = 1;

    if (this.load_mode == "load") {
      var sz = file.start + file.image.length - 1;
      alert("Loaded: " + file.name + 
            "(" + file.start.toString(16) + "-" + sz.toString(16) + "), " +
            "Run by 'G" + file.entry.toString(16) + "'");
    } else {
      console.log("Started", file.name, "from", file.entry.toString(16));
      screen.init_cache();
      this.runner.cpu.jump(file.entry);
    }
  }

  this.switch_panel = function(name) {
    document.getElementById("emulator_panel").style.display =
      name == "emulator" ? "block" : "none";
    document.getElementById("assembler_panel").style.display =
      name == "assembler" ? "block" : "none";
    document.getElementById("keyboard_panel").style.display =
      name == "keyboard" ? "block" : "none";
    document.getElementById("emulator_button").disabled = name == "emulator";
    document.getElementById("assembler_button").disabled = name == "assembler";
    document.getElementById("keyboard_button").disabled = name == "keyboard";
  }

  this.toggle_panel = function(name) {
    if (name == "disassembler" && !this.disassembler_available()) {
      alert("Disassembler is not available.");
      return;
    }
    var name = name + "_panel";
    document.getElementById(name).style.display = 
      document.getElementById(name).style.display == "block" ? "none" : "block";
  }

  this.disassembler_available = function() {
    return window.frames.disassembler_frame.loaded;
  }

  this.save_screen = function() {
    var save_screen_this = this;
    var filename = save_screen_this.screenshot_name + "-" +
                   save_screen_this.screenshot_count + ".png";
    save_screen_this.screenshot_count += 1;
    this.canvas.toBlob(function(blob) {
      saveAs(blob, filename);
    });  
  }
  
  this.load_mode = "run";
  this.load_tape_file("mon32.bin");
}
