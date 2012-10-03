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

function Runner(cpu) {
  this.cpu = cpu;
  this.pause = false;

  const FREQ = 2000000;
  const TICK_PER_MS = FREQ / 100;

  this.cpu.jump(0xf800);

  this.execute = function() {
    if (!this.pause) {
      var ticks = 0;
      while (ticks < TICK_PER_MS) {
        ticks += this.cpu.instruction();
      }
    }
    runner_self = this;
    window.setTimeout(function() { runner_self.execute(); }, 10);
  }
}
