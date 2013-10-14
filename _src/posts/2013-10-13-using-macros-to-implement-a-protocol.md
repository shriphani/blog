    Title: Zephyros Racket API
    Date: 2013-10-13T17:27:00
    Tags: racket, macros, "window managers", zephyros


In the recent past, I wanted to control the OS X window manager from
racket like I could on Linux using the X11 library. I found a very
sweet Github project called
[zephyros](https://github.com/sdegutis/zephyros/) that implemented a
large number of vital routines (vital for managing windows anyway) and
provided a simple protocol using json. Since it would be convenient to
have a racket module, I wrote a wrapper around it.

<!-- more -->

The zephyros protocol has the following format:

<pre>
routine_name receiver args*
</pre>

A <code>routine_name</code> is something like
<code>"move_window"</code>. A <code>receiver</code> is an object
identifier that we are trying to instruct (so if we want to move
window 1 to location <code>(x, y)</code>, the API call looks like
<code>(move-window 1 '(x y))</code>). The receiver is typically
<code>null</code> for routines that cause no state change.

So, our racket API calls look like:
<pre>
(routine-name receiver args*)
</pre>

The zephyros API is asynchronous but I prefer having nothing to do
with this callback business so routines that return a response are
exposed as functions that return values.

There is a general pattern to the routines defined: send a message
with the right arguments, poll for a response if there is any and
return the response (or perform the right state changes). So, we have
this macro that takes a protocol string and a list of symbols
corresponding to the args and then defines a function.

```racket
(define-syntax (protocol->response-function stx)
  (with-syntax ([fn-name (datum->syntax
                             stx
                             (get-fn-name
                              (cadr
                               (syntax->datum stx))))])
   (syntax-case stx ()
     ;; no args and no receiver routines
     [(_ str)     
      #'(define (fn-name)
          (send-message str))]

     ;; no receiver but routine has args
     [(_ str (args ...))
      #'(define (fn-name args ...)
          (send-message str 'null (list args ...)))]

     ;; receiver and args exist
     [(_ str receiver (args ...))
      #'(define (fn-name receiver args ...)
          (send-message str receiver (list args ...)))])))
```

And then one can do this:

```racket
(protocol->response-function "clipboard_contents")
```

And this exports a function <code>clipboard-contents</code> that can
be invoked like so <code>(clipboard-contents)</code>.

Using macros that look a lot like this I was able to define routines
that perform an action, return values, poll for events and build a
clean API that exports zephyros functionality. You can see the final
codebase [here](https://github.com/shriphani/zephyros/blob/master/libs/zephyros.rkt).

The full API is documented [here](https://github.com/shriphani/zephyros/blob/master/Docs/Racket.md).

Now, it is straightforward to use racket to implement custom window
managers for OS X.

Say we want to take the first two windows and then use them to cover
50% of the screen each (while ignoring the rest of the windows), the
script looks like so:

```racket
#lang racket

(require (file "/Applications/Zephyros.app/Contents/Resources/libs/zephyros.rkt"))

(define windows (take (visible-windows) 2))

(define screen-dimensions (frame-without-dock-or-menu (main-screen)))

(define screen-width (hash-ref screen-dimensions 'w))
(define screen-height (hash-ref screen-dimensions 'h))

(set-frame (first windows) (make-hash
                            (list
                             (cons 'x 0)
                             (cons 'y 0)
                             (cons 'h screen-height)
                             (cons 'w (inexact->exact (/ screen-width 2))))))
(focus-window (first windows))

(set-frame (second windows) (make-hash
                             (list
                              (cons 'x (inexact->exact (/ screen-width 2)))
                              (cons 'y 0)
                              (cons 'h screen-height)
                              (cons 'w (inexact->exact (/ screen-width 2))))))
(focus-window (second windows))
```

And this is what happens when we run it (sorry about the 480px video):
<iframe width="420" height="315" src="//www.youtube.com/embed/6kMmS5I7ISU" frameborder="0" allowfullscreen></iframe>
