    Title: A Clojure to Native Compiler Tutorial
    Date: 2013-12-13T17:15:05
    Tags: clojure, scheme, compiler, assembly, tutorial

I spent some time recently working through a
[tutorial](http://scheme2006.cs.uchicago.edu/11-ghuloum.pdf) by Abdulaziz
Ghoulom on a scheme to x86 compiler and wanted to port it to clojure
as an exercise.

Ghoulom's original tutorial is extremely well written and beautiful
because the code-generation component of the compiler treats whatever
clang or gcc produce as templates in which the desired values are
filled. I am a big fan of such tutorials since they get to the point
as quickly as possible.

Ghoulom's tutorial is obviously not a competitor to
[The Dragon Book](http://www.amazon.com/gp/product/0201100886/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0201100886&linkCode=as2&tag=shriswebl-20) 
(which I prefer to the rather poorly written
[Tiger Book](http://www.amazon.com/gp/product/052182060X/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=052182060X&linkCode=as2&tag=shriswebl-20)).
This is a tutorial to pick up when you're looking to kill a few hours.
If you want an education, study the dragon book.

<!-- more -->

First, we need to
