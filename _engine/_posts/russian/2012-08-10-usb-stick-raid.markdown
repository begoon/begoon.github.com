---
layout: post
title: "RAID из USB флешек"
language: russian
date: 2012-08-10 22:26
comments: true
categories: 
- experiment
- russian
---
Нашел я тут пакетик с USB флешками разных лет использования. Как обычно, в работе только две самые последние и самых больших размеров. Остальные -- тут.

![](/images/blog/usb-stick-raid/bunch-of-usb-stricks.jpg)

Размеры от 64 мегов до 32 гигов.

![](/images/blog/usb-stick-raid/usb-stricks-sorted.jpg)

И возникла идея сделать из них RAID, например, просто "concatenated disk", ибо в OSX это делается очень просто. Идеи тут минимум, но было интересно попробовать.

Купил я вот такой девайс на двенадцать сосков.

<a href="http://www.amazon.co.uk/gp/product/B0051PGX2I/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B0051PGX2I&amp;linkCode=as2&amp;tag=prodiy-21">Satechi 12 Port USB Hub with Power Adapter &amp; 2 Control Switches</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B0051PGX2I" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/B0051PGX2I/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B0051PGX2I&amp;linkCode=as2&amp;tag=prodiy-21"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;ASIN=B0051PGX2I&amp;Format=_SL160_&amp;ID=AsinImage&amp;MarketPlace=GB&amp;ServiceVersion=20070822&amp;WS=1&amp;tag=prodiy-21" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B0051PGX2I" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

![](/images/blog/usb-stick-raid/satechi-12-usb-port-extender.jpg)

Втыкаем...

![](/images/blog/usb-stick-raid/usb-stricks-raid-assembled.jpg)

И запускаем Disk Utility. Все флешки, вроде, видятся.

![](/images/blog/usb-stick-raid/disk-utility-disks-connected.png)

Создаем диск типа "concatenated disk" с именем "Crazy RAID" и добавляем туда флешки, предварительно их отформатировав в HPFS+ для единообразия.

![](/images/blog/usb-stick-raid/disk-utility-crazy-raid-created.png)

Подтверждаем...

![](/images/blog/usb-stick-raid/disk-utility-crazy-raid-confirmation.png)

Ждем минут пять и готово.

![](/images/blog/usb-stick-raid/disk-utility-crazy-raid-completed.png)

В системе видится.

![](/images/blog/usb-stick-raid/df-crazy-raid.png)

Можно теперь чего-нибудь туда скопировать.

![](/images/blog/usb-stick-raid/mc-crazy-raid-copying.png)

Конечно, конструктивного применения тут реально ноль, ибо все флешки разные и кроме их объединения в один диск сложно что-то еще сделать в плане RAID. Скорость записи будет определяться той флешкой, на которую идет запись в данный момент. При параллельном чтении, возможно, будет ускорение.

Но выглядит приколько!
