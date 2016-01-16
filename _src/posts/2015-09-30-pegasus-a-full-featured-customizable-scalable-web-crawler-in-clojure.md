    Title: Pegasus: A Full-Featured, Customizable, Scalable Web-Crawler in Clojure
    Date: 2015-09-30T11:57:26
    Tags: clojure, scale, scalable, crawler, web-crawler

[Pegasus](http://getpegasus.io) is a scalable, multithreaded web-crawler
for clojure.

I wrote Pegasus after the existing choices in the Java ecosystem left me
frustrated.

The more popular crawler projects (Heritrix and Nutch) are clunky and not
easy to configure. I have often wanted to be able to supply my own extractors, save payloads directly to a database and so on. Short of digging
into large codebases, there isn't much of an option there.

Tiny crawlers hold all their data structures in memory and are incapable
of crawling the entire web. A simple crash somewhere causes you to
lose all state built over a long-running crawl.

Pegasus gives you the following:

1. Parallelism using the excellent `core.async` library.
2. Disk-backed data structures that allow crawls to survive crashes, system restarts etc.
3. Implements the bare minimum politeness needed in crawlers (support for `robots.txt` and `rel='nofollow'`)

<!-- more -->

A crawl is configured using a config object - a clojure map. All crawl state
such as references to important data-structures, function definitions, crawl-specific
vars, is stored in this config.

The config is available to all critical functions and allows us to
(i) maintain important crawl-state, and (ii) update important data-structures
on-the-fly.

Some critical pieces:

# Process Pipeline

`core.async` allows us to specify a pipeline using `pipeline-blocking`.
The default pipeline in pegasus consists of a set of simple functions.
These routines are invoked by producers and consumers that produce
and consume from, well `core.async` channels.

`schema`'s are used to enforce structural requirements for all processes.

Here's a simple example of the pipeline:

FIXME
```clojure
{
    ...
    :pipeline [:frontier
            :update-cache ; defined during the cache init
            :extractor
            :writer]
    ...
}
```

# Politeness

Politeness is achieved using a combination of:

1. A minimum delay between successive requests to a host.
2. Robots.txt directives.
3. Not following `rel="nofollow"` urls.

# Examples

In this section, I am going to implement some simple crawl tasks.
These should give you a flavor for what's possible.

## Enlive selectors for crawling submissions on reddit
First, let us try to crawl all submissions on reddit. We need to
extract submissions and pagination links. We also stop the crawl
at 1000 documents. Enlive makes it easy to do this sort of stuff.

FIXME
```clojure

```

## XPath selectors for crawling submissions on reddit

In this example, we use XPaths (via the `clj-xpath` library).

FIXME
```clojure
```

## Save reddit submissions to a SQLite database.

In this example, we save crawl-state into a SQLite database

FIXME
```clojure
```
