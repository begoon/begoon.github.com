---
layout: post
title: 'Спрятать кнопку "Пуск" и помигать клавиатурой'
language: russian
date: 2009-02-21 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/blog-post_21.html
categories:
- cplusplus
- russian
---
Я с удовольствием коллекционирую всякие программные штучки-дрючки в виде миниатюрных исходников.

Приведу парочку из загашника. Ни разу не претендую на авторство, так что ценителей авторского права просьба сообщать о возможных нарушениях незамедлительно.

**Убирание кнопки Пуск в Windows**

Данная программа убирает кнопку Пуск (Start) на 5 секунд, а потом возвращает ее назад. Проверял на Windows 2000 и XP. Если программу прервать в отведенные 5 секунд, кнопку Пуск придется восстанавливать повторным запуском программы

{% codeblock lang:cpp %}
#include <windows.h>
int main(void) {
   // Ищем кнопку.
   HWND hWnd;
   hWnd = FindWindow("Shell_TrayWnd", NULL);
   hWnd = FindWindowEx(hWnd, NULL, "BUTTON", NULL);

   // Прячем её.
   ShowWindow(hWnd, SW_HIDE);

   // Ждём.
   Sleep(5000);

   // Показываем обратно.
   ShowWindow(hWnd, SW_SHOW);

   return 0;
}
{% endcodeblock %}

**Мигание индикаторами на клавиатуре**

Данная программа устраивает бегущий огонек по индикаторам `NUM LOCK`, `CAPS LOCK` и `SCROLL LOCK` на более менее обычных клавиатурах.

{% codeblock lang:cpp %}
#include <windows.h>

void kbdLight(WORD code) {
   INPUT input;

   input.type = INPUT_KEYBOARD;
   input.ki.wVk = code;
   input.ki.wScan = 0;
   input.ki.dwFlags = 0;
   input.ki.time = 0;
   input.ki.dwExtraInfo = 0;

   SendInput(1, &input, sizeof(input));

   input.type = INPUT_KEYBOARD;
   input.ki.wVk = code;
   input.ki.wScan = 0;
   input.ki.dwFlags = KEYEVENTF_KEYUP;
   input.ki.time = 0;
   input.ki.dwExtraInfo = 0;

   SendInput(1, &input, sizeof(input));
}

int main(void) {
   while (true) {
      kbdLight(VK_NUMLOCK);
      Sleep(100);
      kbdLight(VK_CAPITAL);
      Sleep(100);
      kbdLight(VK_SCROLL);
      Sleep(100);
   }
   return 0;
}
{% endcodeblock %}

Если у вас есть интересные исходнички подобного рода — прикладывайте в комментарии.

Не все же нам в каких-то конструкторах копаться.
