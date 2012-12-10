@language: english
@date: 2012-12-10 22:00

The console Snake game
======================

This code is not mine, I grabbed it from [itblogs][]. I cleaned up the code
a little bit, removed switching the console background color and added code
for Linux/OSX.

[itblogs]: http://itblogs.org/c-konsolnaya-zmejka/

Agreed, the game is trivial, but I just liked it. Also, I tried [ascii.io][]
recording an asciicast, so you can evaluate gameplay - http://ascii.io/a/1715.

[ascii.io]: http://ascii.io/

[The source][] is available at GitHub'е, but you can simply grab it below.

[The source]: https://github.com/begoon/stuff/tree/master/games/snake/c++

``` c++
// Originally taken from http://itblogs.org/c-konsolnaya-zmejka/.

#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <ctime>
#ifdef WINDOWS
#include <windows.h>
#include <conio.h>
#else
#include <unistd.h>
#include <termios.h>
#include <sys/select.h>

#define STDIN_FILENO 0
#define NB_DISABLE 0
#define NB_ENABLE 1

#define Sleep(x) usleep(x*1000)

int kbhit() {
  struct timeval tv;
  fd_set fds;
  tv.tv_sec = 0;
  tv.tv_usec = 0;
  FD_ZERO(&fds);
  FD_SET(STDIN_FILENO, &fds);
  select(STDIN_FILENO+1, &fds, NULL, NULL, &tv);
  return FD_ISSET(STDIN_FILENO, &fds);
}

void nonblock(int state) {
  struct termios ttystate;

  // Get the terminal state.
  tcgetattr(STDIN_FILENO, &ttystate);

  if (state == NB_ENABLE) {
    // Turn off canonical mode.
    ttystate.c_lflag &= ~ICANON;
    // Minimum of number input read.
    ttystate.c_cc[VMIN] = 1;
  } else if (state == NB_DISABLE) {
    // Turn on canonical mode.
    ttystate.c_lflag |= ICANON;
  }
  // Set the terminal attributes.
  tcsetattr(STDIN_FILENO, TCSANOW, &ttystate);
}

int getch() {
  return fgetc(stdin);
}

#endif

int snake_size, change_x, change_y, coordinates_x[1000], coordinates_y[1000];
int food_x = -1, food_y = -1;

char symbol, a[1000][1000];

const int N = 13, M = 17, INTERVAL = 200;

void change_direction() {
  symbol = getch();
  switch (symbol) {
    case 'w': if (change_x != 1 || change_y != 0) {
                change_x = -1; change_y = 0;
              }
              break;
    case 'a': if (change_x != 0 || change_y != 1) {
                change_x = 0; change_y = -1;
              }
              break;
    case 's': if (change_x != -1 || change_y != 0) {
                change_x = 1; change_y = 0;
              }
              break;
    case 'd': if (change_x != 0 || change_y != -1) {
                change_x = 0; change_y = 1;
              }
              break;
#ifndef WINDOWS
    case 'q': nonblock(NB_DISABLE); std::exit(0);
#endif
    default: break;
  }
}

void show_table() {
#ifdef WINDOWS
  system("cls");
#else
  system("clear");
#endif
  for (int i = 0; i <= N + 1; ++i)
    for (int j = 0; j <= M + 1; ++j)
      std::cout
        << (i == 0 || j == 0 || i == N + 1 || j == M + 1 ?
           '#' : a[i][j])
        << (j <= M ? "" : "\n");
}

void clear_snake_on_table() {
  for (int i = 1; i <= snake_size; ++i)
    a[coordinates_x[i]][coordinates_y[i]] = ' ';
}

void show_snake_on_table() {
  if (change_x == 1 && change_y == 0)
    a[coordinates_x[1]][coordinates_y[1]] = 'v';
  if (change_x == -1 && change_y == 0)
    a[coordinates_x[1]][coordinates_y[1]] = '^';
  if (change_x == 0 && change_y == 1)
    a[coordinates_x[1]][coordinates_y[1]] = '>';
  if (change_x == 0 && change_y == -1)
    a[coordinates_x[1]][coordinates_y[1]] = '<';

  for (int i = 2; i <= snake_size; ++i)
    a[coordinates_x[i]][coordinates_y[i]] = '@';
}

bool game_over() {
  for (int i = 2; i <= snake_size; ++i)
    if (coordinates_x[1] == coordinates_x[i] &&
        coordinates_y[1] == coordinates_y[i])
      return true;
  return false;
}

void check_coordinates() {
  if (coordinates_x[1] > N) coordinates_x[1] = 1;
  if (coordinates_x[1] < 1) coordinates_x[1] = N;
  if (coordinates_y[1] > M) coordinates_y[1] = 1;
  if (coordinates_y[1] < 1) coordinates_y[1] = M;
}

void next_step() {
  clear_snake_on_table();

  for (int i = snake_size; i >= 2; --i) {
    coordinates_x[i] = coordinates_x[i - 1];
    coordinates_y[i] = coordinates_y[i - 1];
  }

  coordinates_x[1] += change_x;
  coordinates_y[1] += change_y;

  check_coordinates();

  if (coordinates_x[1] == food_x && coordinates_y[1] == food_y) {
    snake_size++;
    food_x = -1;
    food_y = -1;
  }

  show_snake_on_table();

  if (game_over()) {
    std::cout << "You're looser! \n";
#ifdef WINDOWS
    system("pause");
#endif
    std::exit(0);
  }
}

bool food_check() {
  if (food_x == -1 && food_y == -1) return false;
  return true;
}

void place_food() {
  std::srand(std::time(NULL));
  for (int i = 1; i <= 9; ++i) {
    int x = std::rand(), y = std::rand();
    if (x < 0) x *= -1;
    if (y < 0) y *= -1;
    x %= (N + 1);
    y %= (M + 1);
    if (x == 0) ++x;
    if (y == 0) ++y;
    if (a[x][y] != '@' && a[x][y] != 'v' && a[x][y] != '^' &&
        a[x][y] != '<' && a[x][y] != '>') {
      food_x = x;
      food_y = y;
      a[x][y] = '+';
      return;
    }
  }
}

void standart_settings() {
  snake_size = 2;

  coordinates_x[1] = 1;
  coordinates_y[1] = 2;
  coordinates_x[2] = 1;
  coordinates_y[2] = 1;

  change_x = 0;
  change_y = 1;
}

int main() {
  standart_settings();

#ifndef WINDOWS
  std::memset(a, ' ', sizeof(a));
  nonblock(NB_ENABLE);
#endif

  while (true) {
    if (kbhit() != 0)
     change_direction();

    next_step();

    if (!food_check())
      place_food();

    show_table();

    Sleep(INTERVAL);
  }
}
```

P.S.
----

By the way, if you have similar cool console stuff, please share.
