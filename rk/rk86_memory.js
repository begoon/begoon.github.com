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

function Memory(keyboard) {
  this.keyboard = keyboard;

  this.init = function() {
    this.buf = [];
    for (var i = 0; i < 0x10000; ++i) this.buf[i] = 0;
  }

  this.zero_ram = function() {
    for (var i = 0; i < 0x8000; ++i) this.buf[i] = 0;
  }

  this.vg75_c001_00_cmd = 0;

  this.screen_size_x_buf = 0;
  this.screen_size_y_buf = 0;

  this.ik57_e008_80_cmd = 0;
  this.vg75_c001_80_cmd = 0;

  this.cursor_x_buf = 0;
  this.cursor_y_buf = 0;

  this.tape_8002_as_output = 0;

  this.video_memory_base_buf = 0;
  this.video_memory_size_buf = 0;

  this.video_memory_base = 0;
  this.video_memory_size = 0;

  this.video_screen_size_x = 0;
  this.video_screen_size_y = 0;

  this.video_screen_cursor_x = 0;
  this.video_screen_cursor_y = 0;

  this.init();

  this.length = function() { return 0x10000; }

  this.read_raw = function(addr) {
    addr &= 0xffff;
    return this.buf[addr] & 0xff;
  }

  this.read = function(addr) {
    addr &= 0xffff;

    if (addr == 0x8002) 
      return this.keyboard.modifiers;

    if (addr == 0x8001) {
      var keyboard_state = this.keyboard.state;
      var ch = 0xff;
      var kbd_scanline = ~this.buf[0x8000];
      for (var i = 0; i < 8; i++)
        if ((1 << i) & kbd_scanline)
          ch &= keyboard_state[i];
      return ch;
    }

    if (addr == 0xC001)
      return 0xff;

    return this.buf[addr];
  }

  this.last_written_byte = -1;

  this.write_raw = function(addr, byte) {
    this.buf[addr & 0xffff] = byte & 0xff;
  }

  this.write = function(addr, byte) {
    addr &= 0xffff;
    byte &= 0xff;

    if (addr >= 0xF800) return;

    this.buf[addr] = byte;

    var peripheral_reg = addr & 0xefff;

    // RUS/LAT indicator
    if (peripheral_reg == 0x8003) {
      if (byte == this.last_written_byte) return;
      // The indicator status can is "byte & 0x01".
      this.last_written_byte = byte;
      return;
    }

    // The cursor control sequence.
    if (peripheral_reg == 0xc001 && byte == 0x80) {
      this.vg75_c001_80_cmd = 1;
      return;
    }

    if (peripheral_reg == 0xc000 && this.vg75_c001_80_cmd == 1) {
      this.vg75_c001_80_cmd += 1;
      this.cursor_x_buf = byte + 1;
      return;
    }

    if (peripheral_reg == 0xc000 && this.vg75_c001_80_cmd == 2) {
      this.cursor_y_buf = byte + 1;
      screen.set_cursor(this.cursor_x_buf - 1, this.cursor_y_buf - 1);
      this.video_screen_cursor_x = this.cursor_x_buf;
      this.video_screen_cursor_y = this.cursor_y_buf;
      this.vg75_c001_80_cmd = 0;
      return;
    }

    // The screen format command sequence.
    if (peripheral_reg == 0xc001 && byte == 0) {
      this.vg75_c001_00_cmd = 1;
      return;
    }

    if (peripheral_reg == 0xc000 && this.vg75_c001_00_cmd == 1) {
      this.screen_size_x_buf = (byte & 0x7f) + 1;
      this.vg75_c001_00_cmd += 1;
      return;
    }

    if (peripheral_reg == 0xc000 && this.vg75_c001_00_cmd == 2) {
      this.screen_size_y_buf = (byte & 0x3f) + 1;
      this.vg75_c001_00_cmd = 0;
      return;
    }

    // The screen area parameters command sequence.

    if (peripheral_reg == 0xe008 && byte == 0x80) {
      this.ik57_e008_80_cmd = 1;
      this.tape_8002_as_output = 1;
      return;
    }

    if (peripheral_reg == 0xe004 && this.ik57_e008_80_cmd == 1) {
      this.video_memory_base_buf = byte;
      this.ik57_e008_80_cmd += 1;
      return;
    }

    if (peripheral_reg == 0xe004 && this.ik57_e008_80_cmd == 2) {
      this.video_memory_base_buf |= byte << 8;
      this.ik57_e008_80_cmd += 1;
      return;
    }

    if (peripheral_reg == 0xe005 && this.ik57_e008_80_cmd == 3) {
      this.video_memory_size_buf = byte;
      this.ik57_e008_80_cmd += 1;
      return;
    }

    if (peripheral_reg == 0xe005 && this.ik57_e008_80_cmd == 4) {
      this.video_memory_size_buf = ((this.video_memory_size_buf | (byte << 8)) & 0x3fff) + 1;
      this.ik57_e008_80_cmd = 0;
      return;
    }

    // Settings for video memory boundaries and the screen format
    // only take an effect after the DMA command 0xA4 (start the channel).
    if (peripheral_reg == 0xe008 && byte == 0xa4) {
      if (this.screen_size_x_buf && this.screen_size_y_buf) {
        // Save ("apply") the screen dimentions.
        this.video_screen_size_x = this.screen_size_x_buf;
        this.video_screen_size_y = this.screen_size_y_buf;
        // Save ("apply") the video area parameters.
        this.video_memory_base = this.video_memory_base_buf;
        this.video_memory_size = this.video_memory_size_buf;
        // Re-configure video.
        screen.set_geometry(this.video_screen_size_x, this.video_screen_size_y,
                            this.video_memory_base);
      }

      this.tape_8002_as_output = 0;
      return;
    }

    if (addr == 0x8002) {
      // Tape I/O isn't implemented yet.
      // if (this.tape_8002_as_output)
      //   this.tape_write_bit(byte & 0x01);
      return;
    }
  }

  this.load_file = function(file) {
    for (var i = file.start; i <= file.end; ++i) {
      this.write_raw(i, file.image.charCodeAt(i - file.start));
    }
  }
}
