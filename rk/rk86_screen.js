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

function Screen(font_image, ui, memory) {
  this.ui = ui;
  this.memory = memory;

  const update_rate = 25;
  const cursor_rate = 500;

  const char_width = 6;
  const char_height = 8;
  const char_height_gap = 2;

  const cursor_width = char_width;
  const cursor_height = 1;
  const cursor_offset_white = 27;

  this.scale_x = 2;
  this.scale_y = 2;

  this.width = 78;
  this.height = 30;

  this.cursor_state = true;
  this.cursor_x = 0;
  this.cursor_y = 0;

  this.video_memory_base = 0;
  this.video_memory_size = 0;

  this.cache = [];

  this.font = new Image();
  this.font.src = "rk86_font.bmp";

  this.init_cache = function(sz) {
    for (var i = 0; i < sz; ++i) this.cache[i] = true;
  }

  this.draw_char = function(x, y, ch) {
    this.ctx.drawImage(this.font, 
      2, char_height * ch, char_width, char_height,
      x * char_width * this.scale_x, y * (char_height + char_height_gap) * this.scale_y, 
      char_width * this.scale_x, char_height * this.scale_y
    );
  }

  this.draw_cursor = function(x, y, visible) {
    this.ctx.drawImage(this.font,
      2, cursor_offset_white + (visible ? 0 : 1), char_width, 1,
      x * char_width * this.scale_x, 
      (y * (char_height + char_height_gap) + char_height) * this.scale_y, 
      char_width * this.scale_x, 1 * this.scale_y
    )
  }

  this.flip_cursor = function() {
    this.draw_cursor(this.cursor_x, this.cursor_y, this.cursor_state);
    this.cursor_state = !this.cursor_state;
    flip_cursor_self = this;
    window.setTimeout(function() { flip_cursor_self.flip_cursor(); }, 500);
  }

  this.init = function() {
    this.ctx = this.ui.canvas.getContext("2d");
    this.ctx.fillStyle = "rgb(0,0,0)";
  }

  this.set_geometry = function(width, height, base) {
    this.width = width;
    this.height = height;
    this.video_memory_base = base;
    this.video_memory_size = width * height;

    console.log("Screen geometry is changed:", width, height,
                this.video_memory_base.toString(16),
                this.video_memory_size.toString(16));

    var canvas_width = this.width * char_width * this.scale_x;
    var canvas_height = this.height * (char_height + char_height_gap) * this.scale_y;
    this.ui.resize_canvas(canvas_width, canvas_height);

    this.ctx.fillRect(0, 0, canvas_width, canvas_height);

    this.init_cache(this.video_memory_size);
  }

  this.set_view = function(width, height, scale_x, scale_y) {
    this.scale_x = scale_x;
    this.scale_y = scale_y;
    this.set_geometry(width, height, this.video_memory_base);
  }

  this.set_cursor = function(x, y) {
    this.draw_cursor(this.cursor_x, this.cursor_y, false);
    this.cursor_x = x;
    this.cursor_y = y;
  }

  this.draw_screen = function() {
    var i = this.video_memory_base;
    for (var y = 0; y < this.height; ++y) {
      for (var x = 0; x < this.width; ++x) {
        var cache_i = i - this.video_memory_base;
        var ch = this.memory.read(i);
        if (this.cache[cache_i] != ch) {
          this.draw_char(x, y, ch);
          this.cache[cache_i] = ch;
        }
        i += 1;
      }
    }
    self = this;
    window.setTimeout(function() { self.draw_screen(); }, this.update_rate);
  }

  this.init();

  screen_self = this;
  window.setTimeout(function() { screen_self.flip_cursor(); }, cursor_rate);
  window.setTimeout(function() { screen_self.draw_screen(); }, this.update_rate);
}
