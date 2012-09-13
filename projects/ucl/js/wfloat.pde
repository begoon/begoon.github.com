// The next line is needed if running in JavaScript Mode with Processing.js
/* @pjs preload="jbase.png,temenos.png"; */

PImage banner_img;
int[] banner_pixels;

PImage text_img;
int[] text_pixels;

int white = color(255);

void createText() {
  text_img = loadImage("temenos.png");
  text_pixels = text_img.pixels;
}

void createBanner() {
  banner_img = loadImage("jbase.png");
  banner_pixels = banner_img.pixels;
}

void setup() {
  size(300, 200);

  createBanner();
  createText();

  loadPixels();
  frameRate(30);
}

float z_offset(float x, float y, float time) {
  x = 2*x;
  y = 2*y;
  float x2 = 2*x; 
  float y2 = 2*y;
  return sin(cos(time) + x) + cos(sin(time) + y) + 0.5*sin(0.3*time + sqrt(x2*x2 + y2*y2));
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
        float z = 0.25 * z_offset(x, y, time);
        if (time < 8) {
          z -= 1-time/8;
        } 

        final float zdiv = 2/(1 + z);

        final float u = x*zdiv;
        final float v = y*zdiv;

        final int iu = banner_img.width/2 + floor(u*banner_img.width/2);
        final int iv = banner_img.height + floor(1.8*v*banner_img.height/2);  

        if (iu >= 0 && iu < banner_img.width && iv >= 0 && iv < banner_img.height) {
          int b = banner_pixels[iu + iv*banner_img.width];
          pixel = color(b);
        }
      }

      // render text
      if (pixel == -1 && iy > height/2 + 5 ) {
        final int ty = -2;
        final int z = iy;
        final float zdiv = 1/(1+0.01*z);
        final float u = x*zdiv;
        final float v = ty*zdiv;

        final int iu = text_img.width/2 + floor(u*3*text_img.width/2);
        final int iv = (text_img.height/2 + floor(v*1*text_img.height/2 + time*20) - text_img.height/8) % text_img.height;

        if (iu >= 0 && iu < text_img.width && iv >= 0 && iv < text_img.height) {
          final color c = text_pixels[iu + iv*text_img.width];
          if (c == -1) {
            pixel = c;
          }
          else {
            final int add = ((zmax - z)*4)/3;
            pixel = color(255, 64 + add, 64 + add);
          }
        }
      }

      pixels[iy*width + ix] = pixel == -1 ? white : pixel;
    }
  }

  updatePixels();
}
