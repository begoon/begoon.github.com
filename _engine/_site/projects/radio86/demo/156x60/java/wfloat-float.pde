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
}

float z_offset(float x, float y, float time) {
  x = 2*x; y = 2*y;
  float x2 = 2*x; 
  float y2 = 2*y;
  return sin(sin(time + Math.PI/2) + x) + sin(sin(time) + y + Math.PI/2);
}

void draw() {
  final float time = frameCount * 0.1;
  final int zmax = height;

  for (int iy = 0; iy < height; iy++) {
    final float y = 2.0 * iy / height - 1.0;
    for (int ix = 0; ix < width; ix++) {
      final float x = 2.0*(ix - width/2)/width;

      color pixel = -1;

      // render the banner
      {
        float z = 0.25 * z_offset(x, y, time*0.3);
        if (time < 8) {
          z -= 1-time/8;
        } 

        final float zdiv = 2/(1 + z);

        final float u = x*zdiv;
        final float v = y*zdiv;

        final int iu = banner_img.width/2 + floor(0.6*u*banner_img.width/2) + 10;
        final int iv = banner_img.height/2 + floor(0.5*v*banner_img.height/2);

        if (iu >= 0 && iu < banner_img.width && iv >= 0 && iv < banner_img.height) {
          int b = banner_pixels[iu + iv*banner_img.width];
          pixel = color(b);
        }
      }
      pixels[iy*width + ix] = pixel == -1 ? white : pixel;
      rk86_pixel(ix, iy, pixel == -1 ? 0 : 1);
    }
  }

  rk86_draw_bitmap();

  updatePixels();
}
