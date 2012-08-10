---
layout: post
title: "USB stick RAID"
language: english
date: 2012-08-10 22:26
comments: true
categories: 
- english
- experiment
---
I've found a bag with a bunch of my old USB sticks I used some time ago. Usually only one or two with maximum capacity is in use, and others are here.

![](/images/blog/usb-stick-raid/bunch-of-usb-stricks.jpg)

From 64MB to 32GB.

![](/images/blog/usb-stick-raid/usb-stricks-sorted.jpg)

An idea occured to join them all together into RAID, for example, a concatenated disk. In OSX it can be done in a few clicks. The idea is pretty silly but it was interesting to try.

I've bought an extender with 12 ports.

<a href="http://www.amazon.co.uk/gp/product/B0051PGX2I/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B0051PGX2I&amp;linkCode=as2&amp;tag=prodiy-21">Satechi 12 Port USB Hub with Power Adapter &amp; 2 Control Switches</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B0051PGX2I" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

![](/images/blog/usb-stick-raid/satechi-12-usb-port-extender.jpg)

Plugging them all in...

![](/images/blog/usb-stick-raid/usb-stricks-raid-assembled.jpg)

Start the Disk Utility and check that all the sticks are recognized.

![](/images/blog/usb-stick-raid/disk-utility-disks-connected.png)

Create a "concatenated disk" named "Crazy RAID" and add the sticks into there.

![](/images/blog/usb-stick-raid/disk-utility-crazy-raid-created.png)

Confirming...

![](/images/blog/usb-stick-raid/disk-utility-crazy-raid-confirmation.png)

Wait for five minutes and it's done.

![](/images/blog/usb-stick-raid/disk-utility-crazy-raid-completed.png)

"df" perfectly sees the drive.

![](/images/blog/usb-stick-raid/df-crazy-raid.png)

Now we can copy something there and check the transfer rate.

![](/images/blog/usb-stick-raid/mc-crazy-raid-copying.png)

Of course, this is just a toy without real usage. All the sticks have different capacity, so the concatenated disk is the only choice in terms of the RAID features. Write speed depends on a particular stick which is currently in use. On concurrent read we may gain some speedup.

But it looks cool!
