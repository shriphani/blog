    Title: Pegasus: A Full-Featured, Customizable, Scalable Web-Crawler in Clojure
    Date: 2015-09-30T11:57:26
    Tags: clojure, scale, scalable, crawler, web-crawler

In this blog post, I will describe a new web-crawler I've been working on
called Pegasus.

I wrote Pegasus after the existing choices in the Java ecosystem left me
frustrated.

The more popular crawler projects (Heritrix and Nutch) are clunky and not
trivially configurable.

Tiny crawlers are barely beyond toy projects - they retain all their data-structures
in memory. A simple crash somewhere causes you to lose all the precious state you
built up over time.

Pegasus gives you the following:

1. Async behavior using the excellent `core.async` library.
2. Politeness - by following `nofollow` and `robots.txt` directives.
3. 


<!-- more -->
