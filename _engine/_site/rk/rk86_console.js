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

function Console() {

  this.adjust_window = function() {
    var callback = function() {
      var term_div = document.getElementById("termDiv");
      InnerWindowResizer(term_div.clientWidth + 16, term_div.clientHeight);
    }
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
      window.setTimeout(function() { callback(); }, 200);
    else
      callback();
  }

  const from_rk86_table = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    " ",  "!",  "\"",  "#",  "$",  "%%",  "&",  "'",
    "(",  ")",  "*",  "+",  ",",  "-",  ".",  "/",
    "0",  "1",  "2",  "3",  "4",  "5",  "6",  "7",
    "8",  "9",  ":",  ";",  "<",  "=",  ">",  "?",
    "@",  "A",  "B",  "C",  "D",  "E",  "F",  "G",
    "H",  "I",  "J",  "K",  "L",  "M",  "N",  "O",
    "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",
    "X",  "Y",  "Z",  "[",  "\\",  "]",  "^",  "_",
    "Ю",  "А",  "Б",  "Ц",  "Д",  "Е",  "Ф",  "Г",
    "Х",  "И",  "Й",  "К",  "Л",  "М",  "Н",  "О",
    "П",  "Я",  "Р",  "С",  "Т",  "У",  "Ж",  "В",
    "Ь",  "Ы",  "З",  "Ш",  "Э",  "Щ",  "Ч",  "~",
  ];

  this.dump_cmd = function(self) {

    if (typeof self.dump_cmd.last_address == 'undefined')
      self.dump_cmd.last_address = 0;

    if (typeof self.dump_cmd.last_length == 'undefined')
      self.dump_cmd.last_length = 128;

    var from = parseInt(self.term.argv[1]);
    if (isNaN(from)) from = self.dump_cmd.last_address;

    var sz = parseInt(self.term.argv[2]);
    if (isNaN(sz)) sz = self.dump_cmd.last_length;
    self.dump_cmd.last_length = sz;

    var mem = self.runner.cpu.memory;

    const width = 16;
    while (sz > 0) {
      var bytes = "";
      var chars = "";
      var chunk_sz = Math.min(width, sz);
      for (var i = 0; i < chunk_sz; ++i) {
        var ch = mem.read_raw(from + i);
        bytes += "%02X ".format(ch);
        chars += ch >=32 && ch < 127 ? from_rk86_table[ch] : ".";
      }
      if (sz < width) {
        bytes += " ".repeat((width - sz) * 3);
        chars += " ".repeat(width - sz);
      }
      self.term.write("%04X: %s | %s".format(from, bytes, chars));
      self.term.newLine();
      sz -= chunk_sz;
      from = (from + chunk_sz) & 0xffff;
    }
    self.dump_cmd.last_address = from;
  }

  this.disasm_print = function(self, addr, nb_instr) {
    var mem = self.runner.cpu.memory;
    while (nb_instr-- > 0) {
      var binary = [];
      for (var i = 0; i < 3; ++i)
        binary[binary.length] = mem.read_raw(addr + i);
      var instr = i8080_disasm(binary);

      var bytes = "";
      var chars = ""
      for (var i = 0; i < instr.length; ++i) {
        var ch = binary[i];
        bytes += "%02X".format(ch);
        chars += ch >=32 && ch < 127 ? from_rk86_table[ch] : ".";
      }
      bytes += " ".repeat((binary.length - instr.length) * 2);
      chars += " ".repeat(binary.length - instr.length);

      self.term.write("%04X: %s %s %s".format(addr, bytes, chars, instr.instr));
      self.term.newLine();
      addr += instr.length;
    }
    return addr;
  }

  this.cpu_cmd = function(self) {
    var cpu = self.runner.cpu;
    var mem = cpu.memory;
    self.term.write("PC=%04X A=%02X F=%s%s%s%s%s HL=%04X DE=%04X BC=%04X SP=%04X"
                    .format(
                      cpu.pc, cpu.a(), 
                      (cpu.cf ? "C":"-"),
                      (cpu.pf ? "P":"-"),
                      (cpu.hf ? "H":"-"),
                      (cpu.zf ? "Z":"-"),
                      (cpu.sf ? "S":"-"),
                      cpu.hl(), cpu.de(), cpu.bc(), cpu.sp));
    self.term.newLine();

    self.disasm_print(self, cpu.pc, 4);

    hex = function(addr, title) {
      var bytes = "";
      var chars = "";
      for (var i = 0; i < 16; ++i) {
        var ch = mem.read_raw(addr + i);
        bytes += "%02X ".format(ch);
        chars += ch >=32 && ch < 127 ? from_rk86_table[ch] : ".";
      }
      self.term.write("%s=%04X: %s | %s".format(title, addr, bytes, chars));
      self.term.newLine();
    }

    hex(cpu.pc, "PC");
    hex(cpu.sp, "SP");
    hex(cpu.hl(), "HL");
    hex(cpu.de(), "DE");
    hex(cpu.bc(), "BC");
  }

  this.disasm_cmd = function(self) {
    if (typeof self.disasm_cmd.last_address == 'undefined')
      self.disasm_cmd.last_address = 0;

    if (typeof self.disasm_cmd.last_length == 'undefined')
      self.disasm_cmd.last_length = 20;
    
    var cpu = self.runner.cpu;
    var mem = cpu.memory;

    var from = parseInt(self.term.argv[1]);
    if (isNaN(from)) from = self.disasm_cmd.last_address;

    var sz = parseInt(self.term.argv[2]);
    if (isNaN(sz)) sz = self.disasm_cmd.last_length;
    self.disasm_cmd.last_length = sz;

    self.disasm_cmd.last_address = self.disasm_print(self, from, sz);
  }

  this.write_byte_cmd = function(self) {
    var mem = self.runner.cpu.memory;

    if (self.term.argc < 3) { self.term.write("?"); return; }
    var addr = parseInt(self.term.argv[1]);
    if (isNaN(addr)) addr = 0;

    for (var i = 2; i < self.term.argc; ++i) {
      var ch = parseInt(self.term.argv[i]);
      if (isNaN(ch)) break;
      self.term.write("%04X: %02X -> %02X".format(addr, mem.read_raw(addr), ch));
      self.term.newLine();
      mem.write_raw(addr, ch);
      ++addr;
    }
  }

  this.write_word_cmd = function(self) {
    var mem = self.runner.cpu.memory;

    if (self.term.argc < 3) { self.term.write("?"); return; }
    var addr = parseInt(self.term.argv[1]);
    if (isNaN(addr)) addr = 0;

    var term = self.term;
    for (var i = 2; i < self.term.argc; ++i) {
      var w16 = parseInt(self.term.argv[i]);
      if (isNaN(w16)) break;
      var l = w16 & 0xff;
      var h = w16 >> 8;

      term.write("%04X: %02X -> %02X".format(addr, mem.read_raw(addr), l));
      term.newLine();
      mem.write_raw(addr, l);
      ++addr;

      term.write("%04X: %02X -> %02X".format(addr, mem.read_raw(addr), h));
      term.newLine();
      mem.write_raw(addr, h);
      ++addr;
    }
  }

  this.write_char_cmd = function(self) {
    var mem = self.runner.cpu.memory;

    if (self.term.argc < 3) { self.term.write("?"); return; }
    var addr = parseInt(self.term.argv[1]);
    if (isNaN(addr)) addr = 0;

    var s = self.term.argv[2];
    if (!s || s.length == 0) return;

    var term = self.term;
    for (var i = 0; i < s.length; ++i) {
      var ch = s.charCodeAt(i) & 0xff;

      term.write("%04X: %02X -> %02X".format(addr, mem.read_raw(addr), ch));
      term.newLine();
      mem.write_raw(addr, ch);
      ++addr;
    }
  }

  this.print_breakpoint = function(self, n, b) {
    self.term.write("Breakpoint #%s %s %s %04X"
      .format(n, b.type, b.active == "yes" ? "active" : "disabled", b.address));
    if (b.count)
      self.term.write(" count:%d/%d".format(b.count, b.hits));
    self.term.newLine();
  }

  this.execute_after_breakpoint = false;

  this.process_breakpoint = function(self, i, b) {
    self.print_breakpoint(self, i, b);
    self.pause_cmd(this);
    self.term.prompt();
    window.focus();
    self.execute_after_breakpoint = true;
  }

  this.stop_after_next_instruction = -1;
  this.step_over_address = -1;
	
  this.tracer_callback = function(self, cpu) {
    // After entering into the single step mode ('s' command) we have to
    // execute one instruction (because CPU commands are executed AFTER
    // processing console commands) and then stop before the next one.
    // So the 's' command sets "stop_after_next_instruction" to 0, we
    // catch that in this callback, execute and current command, then set
    // "stop_after_next_instruction" to 1 and then use this as the
    // condition to stop before the next instruction.
    if (self.stop_after_next_instruction == 1) {
      self.pause_cmd(this);
      self.term.prompt();
      self.stop_after_next_instruction = -1;
      return;
    }

    if (self.stop_after_next_instruction == 0)
      self.stop_after_next_instruction = 1;

    // After hitting a breakpoint, we have to forcibly execute the current
    // instruction. Otherwise it will hit the same breakpoint immediatelly
    // and execution will be stuck.
    if (self.execute_after_breakpoint) {
      self.execute_after_breakpoint = false;
      return false;
    }

    for (var i in self.breaks) {
      var b = self.breaks[i];
      if (b == null) continue;
      if (b.active == "yes" && b.address == cpu.pc && b.type == "exec") {
        if (!b.count) {
          self.process_breakpoint(self, i, b);
        } else {
          ++b.hits;
          if (b.hits == b.count) {
            self.process_breakpoint(self, i, b);
            b.hits = 0;
          }
        }
        if (b.temporary == "yes") self.breaks[i] = null;
      }
    }
  }

  this.debug_cmd = function(self) {
    var state = self.term.argv[1];
    var tracer = self.runner.tracer;
    
    if (state == "on" || state == "off") {
      if (state == "on") {
        var trace_cmd_this = self;
        self.term.write("Tracing is on");
        self.term.newLine();
        var debug_cmd_this = self;
        self.runner.tracer = function() {
          var cpu = self.runner.cpu;
          return self.tracer_callback(self, cpu);
        }
      } else {
        self.runner.tracer = null;
        self.term.write("Tracing is off");
      }
    } else {
      self.term.write("Trace is %s".format(tracer ? "on" : "off"));
    }
  }

  this.check_tracer_active = function(self) {
    if (self.runner.tracer == null) {
      self.term.write("Tracing is not active. Use 't' command to activate.");
      self.term.newLine();
      return false;
    }
    return true;
  }

  this.list_breakpoints_cmd = function(self) {
    for (var i in self.breaks) {
      var b = self.breaks[i];
      if (b == null) continue;
      self.print_breakpoint(self, i, b);
    }
  }

  this.edit_breakpoints_cmd = function(self) {
    var term = self.term;

    if (self.term.argc < 3) { term.write("?"); return; }
    var n = parseInt(term.argv[1]);
    if (isNaN(n)) { term.write("?"); return; }
    if (self.breaks[n] == null)
      self.breaks[n] = { type:"?", active:"no", address:0 };
    var b = self.breaks[n];

    for (var i = 2; i < self.term.argc; ++i) {
      var args = term.argv[i].split(/[:=]/);
      var arg = args.shift();
      var value = args.shift();
      if (["count", "address", "hits"].indexOf(arg) != -1) {
        var num = parseInt(value);
        if (isNaN(num)) { term.write("?"); return; }
        b[arg] = num;
        if (arg == "count") b.hits = 0;
      } else
        b[arg] = value;
    }
  }

  this.pause_cmd = function(self) {
    self.runner.pause();
    self.pause();
    self.ui.update_pause_button(self.runner.paused);
  }
  
  this.resume_cmd = function(self) {
    self.runner.resume();
    self.resume();
    self.ui.update_pause_button(self.runner.paused);
    window.opener.focus();
  }
  
  this.reset_cmd = function(self) {
    self.ui.reset();
    window.opener.focus();
  }
  
  this.restart_cmd = function(self) {
    self.ui.restart();
    window.opener.focus();
  }

  this.go_cmd = function(self) {
    if (self.term.argc < 2) { self.term.write("?"); return; }
    var addr = parseInt(self.term.argv[1]);
    if (isNaN(addr)) { self.term.write("?"); return; };
    self.runner.cpu.jump(addr);
  }
  
  this.single_step_cmd = function(self) {
    if (!self.check_tracer_active(self)) return;
    self.stop_after_next_instruction = 0;
    self.resume_cmd(self);
  }

  this.step_over_cmd = function(self) {
    var cpu = self.runner.cpu;
    var mem = cpu.memory;
    var binary = [];
    for (var i = 0; i < 3; ++i)
      binary[binary.length] = mem.read_raw(cpu.pc + i);
    var instr = i8080_disasm(binary);
    var b = {
      type: "exec",
      address: (cpu.pc + instr.length) & 0xffff,
      active: "yes",
      temporary: "yes"
    };
    self.breaks[1000] = b;
    self.resume_cmd(self);
  }

  this.help_cmd = function(self) {
    for (var cmd in self.commands) {
      self.term.write("%s - %s".format(cmd, self.commands[cmd][1]));
      self.term.newLine();
    }
  }
  
  this.commands = {
    "d": [ this.dump_cmd, 
           "dump memory / d [start_address [, number_of_bytes]]" 
         ],
    "i": [ this.cpu_cmd, "CPU iformation / i" ],
    "z": [ this.disasm_cmd, 
           "disassemble / z [start_address [, number_of_instructions]]" 
         ],
    "w": [ this.write_byte_cmd,
           "write bytes / w start_address byte1, [byte2, [byte3]...]"
         ],
    "ww": [ this.write_word_cmd,
           "write words / ww start_address word1, [word2, [word3]...]"
         ],
    "wc": [ this.write_char_cmd,
           "write characters / ww start_address string"
         ],
    "t": [ this.debug_cmd, "debug control / t [on|off]" ],
    "p": [ this.pause_cmd, "pause CPU / p"
         ],
    "r": [ this.resume_cmd, "resume CPU / r" ],
    "g": [ this.go_cmd, "go to an address / g 0xf86c" ],
    "gr": [ this.reset_cmd, "reset / gr" ],
    "gs": [ this.restart_cmd, "restart / gs" ],
    "s": [ this.single_step_cmd, "single step" ],
    "so": [ this.step_over_cmd, "step over" ],
    "bl": [ this.list_breakpoints_cmd,
           "list breakpoints / bl"
         ],
    "be": [ this.edit_breakpoints_cmd,
           "edit breakpoints / be 1 type:exec address:0xf86c count:3"
         ],
    "?": [ this.help_cmd, "this help / ?"]
  };

  this.breaks = {
    1: { type:"exec", address:0xf86c, active:"yes", count:0, hits:0 },
    2: { type:"exec", address:0xfca5, active:"yes", count:7, hits:0 },
  }
  
  this.terminal_handler = function(term) {
    term.newLine();
    var line = this.lineBuffer;

    this.parser.parseLine(term);

    if (term.argv.length > 0) {
      var cmd = term.argv[0];
      term.argc = term.argv.length;
      cmd = cmd.toLowerCase();
      var fn = this.commands[cmd];
      if (fn) {
        fn = fn[0];
        fn(this);
      }
      else term.write("?");
    }
    term.prompt();
  }

  this.init = function() {
    this.ui = window.opener.ui;
    this.runner = this.ui.runner;

    var init_this = this;
    this.term = new Terminal( {
      handler: function() { init_this.terminal_handler(this); },
      x: 0, y: 0,
      cols: 80, rows: 30,
      closeOnESC: false,
      ps: "]",
      greeting: "Консоль Радио-86РК",
    } );
    this.term.open();

    this.parser = new Parser();
    this.parser.quoteChars = { "\"": true, "'": true };
    this.parser.optionChars = { "-": true };
    this.parser.whiteSpace = { " ": true, "\t": true, ",": true };

    this.adjust_window();
  }

  this.pause = function() {
    this.term.write("Paused at %04X".format(this.runner.cpu.pc));
    this.term.newLine();
    this.cpu_cmd(this);
  }
  
  this.pause_ui_callback = function() {
    this.pause();
    this.term.prompt();
  }

  this.resume = function() {
    this.term.write("Resumed");
  }
  
  this.resume_ui_callback = function() {
    this.resume();
    this.term.prompt();
  }

  this.init();
}

var console;

function main() {
  console = new Console();
}
