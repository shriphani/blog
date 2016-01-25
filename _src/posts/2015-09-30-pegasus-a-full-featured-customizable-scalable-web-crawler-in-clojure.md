    Title: Pegasus: A Modular, Durable Web Crawler For Clojure
    Date: 2016-01-25T00:10:26
    Tags: clojure, scale, scalable, crawler, web-crawler

<img src="https://raw.githubusercontent.com/shriphani/pegasus/master/pegasus_logo.png" />

[Pegasus](http://getpegasus.io) is a durable, multithreaded web-crawler
for clojure.

I wrote Pegasus after the existing choices in the Java ecosystem left me
frustrated.

The more popular crawler projects ([Heritrix](https://webarchive.jira.com/wiki/display/Heritrix/Heritrix) and [Nutch](http://nutch.apache.org/)) are clunky and not
easy to configure. I have often wanted to be able to supply my own extractors,
save payloads directly to a database and so on. Short of digging
into large codebases, there isn't much of an option there.

Tiny crawlers hold all their data structures in memory and are incapable
of crawling the entire web. A simple crash somewhere causes you to
lose all state built over a long-running crawl. I also want to be able to
(at times) modify critical data-structures and functions mid-crawl.

Pegasus gives you the following:

1. Parallelism using the excellent `core.async` library.
2. Disk-backed data structures that allow crawls to survive crashes,
system restarts etc. (I am still implementing the restart bits).
3. Implements the bare minimum politeness needed in crawlers (support for `robots.txt` and `rel='nofollow'`).

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

`schema`'s are used to enforce structural requirements for all components.

Here's a simple example of the pipeline:

```clojure
{:frontier default-frontier-fn
   :extractor default-extractor-fn
   :writer default-writer-fn
   :enqueue queue/enqueue-pipeline
   :update-state default-update-state
   :update-stats default-update-stats
   :test-and-halt default-stop-check
   :filter default-filter
   :stop-sequence [close-wrtr mark-stop]
   :pipeline [[:frontier s/Str 5]
              [:extractor {:url s/Str,
                           :body s/Str,
                           :time s/Int} 5]
              [:update-state {:url s/Str,
                              :body s/Str,
                              :time s/Int
                              :extracted [s/Str]} 5]
              [:filter {:url s/Str
                        :body s/Str
                        :time s/Int
                        :extracted [s/Str]} 5]
              [:writer {:url s/Str
                        :body s/Str
                        :time s/Int
                        :extracted [s/Str]} 5]
              [:enqueue {:url s/Str
                         :body s/Str
                         :time s/Int
                         :extracted [s/Str]} 5]
              [:update-stats {:url s/Str
                              :body s/Str
                              :time s/Int
                              :extracted [s/Str]} 5]
              [:test-and-halt s/Any 5]]}
```

Each component specifies a function-name whose implementation is available
from the config, a schema that specifies the input structure and the parallelism
(i.e. the number of concurrent threads).

# Politeness

Politeness is achieved using a combination of:

1. A minimum delay between successive requests to a host.
2. Robots.txt directives.
3. Not following `rel="nofollow"` urls.

# Durability

A web crawl is a breadth-first search on the web-graph. The critical data-structure
is a queue. I decided to use factual's excellent [durable-queue](https://github.com/Factual/durable-queue).

Every host gets its own named queue and a custom worker pulls from
each queue and pushes it through the pipeline.

Each component accepts an object and attaches a key to it.

In addition, it is important to be able to access the queue's contents
at random. For instance to check if a URL has already been crawled. The
typical approach involves a bloom filter but I chose to go with a key-value
store whose results can be saved to disk - [JCS](https://commons.apache.org/proper/commons-jcs/).

The Heritrix project has successfully used BerkeleyDB. I might write a variant
of pegasus that uses BerkeleyDB in the future.

# Examples

In this section, I am going to implement some simple crawl tasks.
These should give you a flavor for what's possible.

## Enlive selectors for crawling this blog
This snippet crawls all submissions on this blog and the pagination.

<script src="https://gist.github.com/shriphani/35407ab0d43644e56887.js"></script>

## XPath selectors for crawling this blog

This snippet performs the exact same task but with XPaths.

<script src="https://gist.github.com/shriphani/fef9bd1f73abcbdeb2c1.js"></script>

Pegasus is still a WIP and the interfaces exposed are subject to some change
but I should have them fleshed out soon (and I will be spending time on better docs).

# Resources

* Github Project: [[link]](https://github.com/shriphani/pegasus)
* Issues: [[link]](https://github.com/shriphani/pegasus/issues)


If there are any features you want to see or suggestions you have, do let me know.
