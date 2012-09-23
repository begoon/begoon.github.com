// The next line is needed if running in JavaScript Mode with Processing.js
/* @pjs preload="rk2.png"; */

PImage banner_img;
int[] banner_pixels;

int white = color(255);

void createBanner() {
  banner_img = loadImage("rk2.png");
  banner_pixels = banner_img.pixels;
}

void setup() {
  size(78*2, 30*2);
  createBanner();
  loadPixels();
  frameRate(30);
  init_sine_table();
}

int[] sine_table;
int sine_table_scale = 128;
int sine_table_quater = sine_table_scale / 4;

int TWO_PI = 6;
int PI = 3;

void init_sine_table() {
  sine_table = new int[sine_table_quater + 1];
  for (int x = 0; x < sine_table_quater + 1; ++x) {
    sine_table[x] = round(sin(TWO_PI * x / sine_table_scale) * 256);
  }
  println(sine_table);
}

void init_sine_table_() {
  sine_table = [ 
    0
  ];
}

int lookup_sin(int x) {
  if (x < 0) x = PI*256 - x;
  x = int(x*((sine_table_scale/256)) / (TWO_PI)) % sine_table_scale;

  int y = x % sine_table_quater;
  int r;
  if (x < sine_table_quater) r =  sine_table[   y];
  else if (x < sine_table_quater * 2) r =  sine_table[sine_table_quater-y];
  else if (x < sine_table_quater * 3) r = -sine_table[   y];
  else if (x < sine_table_quater * 4) r = -sine_table[sine_table_quater-y];
  return r;
}

int sin_(float a) {
  // float r = sin(a);
  int r = lookup_sin(a);
  return r;
}

int z_offset(int x, int y, int time) {
  x = 2*x; y = 2*y;
  return sin_(sin_(time + 256*PI/2) + x) + 
         sin_(sin_(time) + y + 256*PI/2);
}

void draw() {
  final int time = floor(frameCount * 0.1 * 256) % (256*200);
  final int zmax = height;

  for (int iy = 0; iy < height; iy++) {
    final int y = floor((2.0 * iy / height - 1.0)*256);
    for (int ix = 0; ix < width; ix++) {
      final int x = floor((2.0*(ix - width/2)/width)*256);

      color pixel = -1;

      // render the banner
      {
        int z = floor(0.25 * z_offset(x, y, time/3 /* *0.3 */));
        if (time < 3*256) {
          z -= floor(100*(256*1-(time)/3));
        }

        final int zdiv = (100*256*2/(256*1 + z));
        zdiv = floor(zdiv);

        final int u = x*zdiv;
        final int v = y*zdiv;

        int iu = banner_img.width/2 +
                 int(0.6*u*(banner_img.width/2)/25600)+10;
        int iv = banner_img.height/2 +
                 int(0.7*v*(banner_img.height/2)/25600);

        if (iu >= 0 && iu < banner_img.width && 
            iv >= 0 && iv < banner_img.height) {
          int b = banner_pixels[iu + (iv)*banner_img.width];
          pixel = color(b);
        }
      }
      if (iy == 0 || iy == height-1 || ix == 0 || ix == width-1)
        pixel = 1;
      pixels[iy*width + ix] = pixel == -1 ? white : pixel;
      rk86_pixel(ix, iy, pixel == -1 ? 0 : 1);
    }
  }

  rk86_draw_bitmap();

  updatePixels();
}
