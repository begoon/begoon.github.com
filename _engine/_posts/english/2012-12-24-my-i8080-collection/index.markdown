@language: english
@date: 2012-12-24 22:00
@tags: collection, intel, 8080, i8080

My collection of Intel 8080 microprocessors
===========================================

I started programming twenty year ago coding in machine codes for Intel 8080.
This microprocessor was my lucky pass to the fascinating world of bits and
bytes. Years later developing various emulators of i8080 and tackling with
undocumented and partially documented features of this processor I decided to
collect real chips from different manufacturers and examine them using the
[8080 CPU Exerciser][].

[8080 CPU Exerciser]: http://www.idb.me.uk/sunhillow/8080.html

At the moment I have 20 processors (from Intel, AMD, National Semiconductor,
NEC, Samsung, Texas Instruments, and also manufactured in the Soviet Union and
Czechoslovakia). Amongst chips having a year on the label the earliest is
dated back to 1974 and the latest is 1980. All CPUs except one are fully
functional. I tested them on my [Радио-86РК][].

[Радио-86РК]: /blog/russian/2012/10/07/rk86-sram/

Testing revealed that all processors are identical according to the CPU
Exerciser except clones from AMD. The AMD processors, AM8080 and AM9080A,
behave differently performing bitwise AND operation (ANA and ANI instruction).
Original Intel CPUs and non-AMD clones set the AC (half-carry) flag to the
value of the 3rd bit (A3) from the bitwise OR between the accumulator and the
argument of ANA or ANI. The AMD clones always zero the AC flag in the ANA and
ANI instructions. I don't know why the original Intel CPU calculates the AC
flag in such a weird way.

My i8080 chips
==============

*The double click on the pictures flips the top and the bottom views*.

AMD
---

Interestingly, AMD i8080-compatible chips were reverse-engineered from
schematics literally stolen from Intel. So, the Intel vs AMD war began from
8080.

### 8080A, 1977

![](AM8080A-8507DMA-1977-AMD-PHILIPPINES-top.jpg)

### AM9080, 1977

![](AM9080ACC-D8080A-8015HP-1977-AMD-top.jpg)

![](AM9080ADCB-D8080AB-8102WP-1977-AMD-top.jpg)

![](AM9080APC-P8080A-790EP-1977-AMD-top.jpg)

National Semiconductor
-----------------------

### INS8080AN

![](INS8080AN-P8080A-1927-P4798-CB-FAULTY-top.jpg)

*This chip is faulty.*

### INS8080AN

![](INS8080AN-P8080A-B8436-4798D-3062-top.jpg)

![](INS8080AN-P8080A-B8436A-4798D-3133-top.jpg)

Intel
-----

### 1974

![](INTEL-P8080A-S2701-3626D-INTEL-74-MALAYSIA-7943-top.jpg)

### 1977

![](INTEL-P8080A-2-L1307000-1977-8134-PHILIPPINES-top.jpg)

### 1979

![](INTEL-P8080A-1-U3120121-INTEL-79-8311DT-PHILIPPINES-top.jpg)

### 1980

![](INTEL-P8080A-L4480180E-INTEL-1980-top.jpg)

Russia
------

### KR580IK80A (КР580ИК80A)

![](KR580IK80A-8608-top.jpg)

### KR580VM80A (КР580ВМ80A)

There is the original mini-datasheet in Russian:
[page 1][KR580VM80A-passport-1] and [page 2][KR580VM80A-passport-2].

[KR580VM80A-passport-1]: KR580VM80A-passport-1.jpg
[KR580VM80A-passport-2]: KR580VM80A-passport-2.jpg

![](KR580VM80-8941-top.jpg)

![](KR580VM80A-911-615-top.jpg)

![](KR580VM80A-9102-top.jpg)

NEC
---

![](NEC-JAPAN-D8080AFC-1-X05020-020-top.jpg)

![](NEC-JAPAN-D8080AFC-P77236-top.jpg)

Samsung
-------

![](SAB-8080-A-P-8036-top.jpg)

Telsa (Czechoslovakia)
----------------------

![](TESLAU4M-MHB8080A-top.jpg)

Texas Instruments
------------------

![](TMS8080ANL-BP7718-H8080A-SINGAPORE-top.jpg)

- - - 

This is how I took pictures of all these chips in a quite technological way
using one iPhone and two Raspberry Pi:

![](taking-pictures-using-iphone-and-rpi.jpg)

<script>
var images = document.getElementsByTagName("img");
for (var i = 0; i < images.length; ++i) {
  var img = images[i];
  img.ondblclick = function() {
    var url = this.src;
    if (url.indexOf("-top") != -1)
      this.src = url.replace("-top", "-bottom");
    else
      this.src = url.replace("-bottom", "-top");
  }
}
</script>

P.S.
----

I hope the collection will grow. I still have only one chip in white
ceramic packaging (KR580VM80). If you know i8080 clones from other
manufacturers, which a not listed here, I'd appreciate if you let me know.

If you would like to donate any i8080 chip I'll
be happy putting a reference to you next to the image of the chip.
