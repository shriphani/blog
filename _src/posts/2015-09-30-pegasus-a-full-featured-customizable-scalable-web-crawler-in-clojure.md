    Title: Pegasus: A Full-Featured, Customizable, Scalable Web-Crawler in Clojure
    Date: 2015-09-30T11:57:26
    Tags: clojure, scale, scalable, crawler, web-crawler

In this blog post, I will describe a new web-crawler I've been working on
called Pegasus.

I wrote Pegasus after the existing choices in the Java ecosystem left me
frustrated.

The more popular crawler projects (Heritrix and Nutch) are clunky and not
easy to configure. I have often wanted to be able to supply my own extractors, save payloads directly to a database and so on. Short of digging
into a poorly documented codebase, there are no real options.

Tiny crawlers hold all their data structures in memory and are incapable
of crawling the entire web. A simple crash somewhere causes you to
lose all state built over a long-running crawl.

Pegasus gives you the following:

1. Async behavior using the excellent `core.async` library.
2. Politeness - by following `nofollow` and `robots.txt` directives.
3. A repl to inspect critical data-structures at crawl time.
4. Disk-backed data structures that allow us to checkpoint and recover state.
<!-- more -->

# Process Pipeline

Each routine of the crawler consumes from a channel and
writes to another which the next phase of the pipeline
consumes from and so on.

The channels are provided by `core.async` and allow one to
spin up multiple instances of each pipeline component - thus
you can make several requests in parallel. For instance,
the crawler can make multiple HTTP GET requests to sites
in parallel, extract links and write the web-page bodies
to disk in parallel.

# Politeness

Politeness is achieved using a combination of:

1. A minimum delay between successive requests to a host (I might change
switch from using hosts to using domains obtained from a DNS lookup).
2. Avoiding paths mentioned in `robots.txt`
3. Avoiding links with the attribute `rel=nofollow`

Of course all these parameters are configurable.

# 
