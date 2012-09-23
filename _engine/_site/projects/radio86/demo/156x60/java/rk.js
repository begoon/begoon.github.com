var ctx;
var canvas;

var font = new Image()

var char_width = 6
var char_height = 8
var char_height_gap = 2

var scale_x = 2
var scale_y = 2

var screen_width = 78
var screen_height = 30

// Screen

function screen_draw_char(x, y, ch) {
   ctx.drawImage(font, 
      2, char_height * ch, char_width, char_height,
      x * char_width * scale_x, y * (char_height + 2) * scale_y, 
      char_width * scale_x, char_height * scale_y
   );
}

function screen_set_geometry() {
   canvas.width = screen_width * char_width * scale_x
   canvas.height = screen_height * (char_height + char_height_gap) * scale_y

   ctx = canvas.getContext("2d");

   ctx.fillStyle = "rgb(0,0,0)";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var screen = [];

var gfx = [
  0x00, // 0000
  0x04, // 0001
  0x10, // 0010
  0x14, // 0011
  0x02, // 0100
  0x06, // 0101
  0x12, // 0110
  0x16, // 0111
  0x01, // 1000
  0x05, // 1001
  0x11, // 1010
  0x15, // 1011
  0x03, // 1100
  0x07, // 1101
  0x13, // 1110
  0x17, // 1111
];

function rk86_draw_bitmap() {
    for (var i = 0; i < screen.length;) {
        c = '?'
        var a1 = screen[i];
        var a2 = screen[i + 1];
        var a3 = screen[i + screen_width * 2];
        var a4 = screen[i + screen_width * 2 + 1];
        var c = gfx[(a1 << 3) | (a2 << 2) | (a3 << 1) | a4];
        var x = (i >> 1) % (screen_width * 2);
        var y = Math.floor((i >> 1) / (screen_width * 2));
        screen_draw_char(x, y, c);
        i += 2;
        if ((i % (screen_width * 2)) == 0)
            i += screen_width * 2;
    }
}

function rk86_pixel(x, y, c) {
    screen[y * screen_width * 2 + x] = c
}

function rk86_screen_init() {
  canvas = document.getElementById("canvas")
  if (!canvas.getContext) {
    alert("Tag <canvas> is not support is the browser")
    return;
  }

  font.src = font_image
  screen_set_geometry()
  for (var i = 0; i < screen_height * screen_width * 4; ++i) screen[i] = 0;

  rk86_draw_bitmap();
  return true;
}
