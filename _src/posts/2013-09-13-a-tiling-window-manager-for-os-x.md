    Title: A Tiling Window Manager for OS X
    Date: 2013-09-13T12:07:09
    Tags: 

A few months ago, I implemented TinyWM in racket. My current work
environment is OS X and thus it would be nice to build something for
OS X. I found a library on Github called ZephyrOS that makes it easy
to do exactly what I want. In this post, I will implement:

* routines to talk to the ZephyrOS server;
* routines to arrange and manipulate windows

<!-- more -->

First, we need to be able to talk to ZephyrOS. There is a protocol
where we specify messages (instructions) and receive responses (or
cause the desktop state to change). ZephyrOS places a UNIX socket at
<code>/tmp/zephyros.sock</code>. ZephyrOS accepts messages of the
format: <code>{message-id} {message} {receiver-id} {args...}</code>. And responses
(if there are any) are returned in a similar format. The following
blocks of code suffice for this purpose.
