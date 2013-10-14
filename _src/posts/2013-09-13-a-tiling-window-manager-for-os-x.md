    Title: A Tiling Window Manager for OS X
    Date: 2013-09-13T12:07:09
    Tags: DRAFT

A few months ago, I implemented TinyWM in racket. My current work
environment is OS X and thus it would be nice to build something for
OS X. I found a library on Github called Zephyros that makes it easy
to do exactly what I want. In this post, I will implement:

* routines to talk to the Zephyros server;
* routines to arrange and manipulate windows

<!-- more -->

First, we need to be able to talk to Zephyros. There is a protocol
where we specify messages (instructions) and receive responses (or
cause the desktop state to change). Zephyros places a UNIX socket at
<code>/tmp/zephyros.sock</code>. Zephyros accepts messages of the
format: <code>{message-id} {message} {receiver-id} {args...}</code>. And responses
(if there are any) are returned in a similar format. The full protocol
is available
[here](https://github.com/sdegutis/zephyros/blob/master/Docs/Protocol.md).
We have a global counter that generates message ids. Then a separate
reader thread keeps reading responses from Zephyros and puts them in a
hashtable. This block of code accomplishes that:

Next, we need to express the protocol messages as routines. For
example, the message <code>clipboard_contents</code> should be
expressed as a function <code>clipboard-contents</code>. This function
should send the appropriate message and return the appropriate
response. We can use macros to accomplish this. We have routines that
return values (what are the windows on the page, what are the window
dimensions etc.) and routines which perform actions.
