    Title: Pegasus: A Full-Featured, Customizable, Scalable Web-Crawler in Clojure
    Date: 2015-09-30T11:57:26
    Tags: clojure, scale, scalable, crawler, web-crawler

[Pegasuse](http://getpegasus.io) is a scalable, multithreaded web-crawler
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
3. Implements support for `robots.txt`. So crawls are polite.

<!-- more -->

A crawl is configured using a config - a clojure map. All crawl state
is contained in this map.

Some critical pieces:

# Process Pipeline

`core.async` allows us to specify a pipeline. Critical routines like
the extractor (which consumes a webpage and produces a set of links to
follow), state-updates etc can be parallelized.

Here's a simple example of the pipeline:

```clojure
{:seed nil
                      :frontier default-frontier-fn
                      :extractor default-extractor-fn
                      :writer default-writer-fn
                      :stop default-stop-check
                      :job-dir "/tmp" ; by-default data-structures sit in /tmp. Do change this :)
                      :struct-dir "data-structures"
                      :logs-dir "logs"
                      :corpus-dir "corpus"
                      :pipeline [:frontier
                                 :update-cache ; defined during the cache init phase
                                 :extractor
                                 :writer]
                      :host-last-ping-times (atom {})
                      :min-delay 2
                                        ;:crawled-bloom-filter
                      :estimated-crawl-size 1000000
                      :false-positive-probability 0.01
                      :visited-cache-name "visited-cache"
                      :to-visit-cache-name "to-visit-cache"
                      :num-visited (atom 0)}
```

# Politeness

Politeness is achieved using a combination of:

1. A minimum delay between successive requests to a host.
2. Robots.txt directives.

# Examples

In this section, I am going to implement some simple crawl tasks.
These should give you a flavor for what's possible.

I've tried to strike a balance between simplicity and ability.

```clojure

```
