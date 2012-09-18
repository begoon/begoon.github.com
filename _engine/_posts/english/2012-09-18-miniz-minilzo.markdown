---
layout: post
title: "Embedded compression libraries - miniz and minilzo"
language: english
date: 2012-09-18 20:17
comments: true
categories: 
- english
- minilzo
- miniz
---
For [my emulator of the classic 8-bit computer called Radio-86RK][rk86-maximite]
running on the Maximite microcomputer I needed a compression library.
The emulator has a virtual ROM drive, but the overall amount of files
I wanted to put there was more than 1M, and the capacity of the PIC32
flash was only 512K. So, a cunning plan was to compress the data and then
decompress them on-the-fly inside the PIC.

[rk86-maximite]: https://github.com/begoon/rk86-maximite

Two compression libraries were discovered:

* [miniz][] (zlib and deflate algorithms)
* [minilzo][] (LZO algorithm)

[miniz]: http://code.google.com/p/miniz/
[minilzo]: http://www.oberhumer.com/opensource/lzo/#minilzo

The selection criteria were:

* a single source library without any dependecies
* scrict ANSI C (I used the Microchip XC32 compiler)
* in-memory decompression
* a small static amount of temporary memory for decompression
  (no malloc/calloc) (ideally, it should use the output decompression
  buffer only)

The both libraries compiled and worked for PIC32 without any issues.

On my data miniz provided the 0.78 compression ratio and minilzo - 0.71.
So, both didn't squeeze my data into the 512KB flash of PIC32.

### Overall impression

* miniz is slightly easier to use and more powerfull from the API perspective
* minilzo provides better compression

Also miniz uses **only** the output buffer for decompression, but minilzo
requries at least 16K static buffer.

P.S. I also tried [XZ Embedded][] (LZMA2).  It looked that it compressed
much better but it requires malloc/free API, so I didn't manage to build
it on PIC32 without extra development.

[XZ Embedded]: http://tukaani.org/xz/embedded.html
