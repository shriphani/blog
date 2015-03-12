    Title: Leveraging a scalable web-crawler in clojure
    Date: 2015-03-11T05:29:39
    Tags: clojure, web-crawling, heritrix, java, scalable, www, crawler

[Nutch](http://nutch.apache.org/) and
[Heritrix](https://webarchive.jira.com/secure/Dashboard.jspa) are
battle-tested
web-crawlers. [ClueWeb9](http://www.lemurproject.org/clueweb09.php/),
[ClueWeb12](http://www.lemurproject.org/clueweb12.php/)
and the Common-Crawl corpora employed one of these.

Toy crawlers that hold important data-structures in memory fail
spectacularly when downloading a large number of pages. Heritrix and
Nutch benefit from several man-years of work aimed at stability and
scalability.

In a previous project, I wanted to leverage Heritrix's
infrastructure and the flexibility to implement some custom
components in Clojure. For instance, being able to extract certain links
based on the output of a classifier. Or being able to use simple `enlive`
selectors.

The solution I used was to expose the routines I wanted via a web-server
and have Heritrix request these routines.

This allowed me to use libraries like `enlive` that I am comfortable
with and still avail the benefits of the infra Heritrix provides.

What follows is a library -
[sleipnir](https://github.com/shriphani/sleipnir), that allows you to do
all this in a simple way.

<!-- more -->

## Intuition

You need to specify two routines: (i) an extractor that takes a web-page
and extracts links from it, and (ii) a writer that takes a body and
other information and writes in whatever format you want.

## Getting Started

First, download and spin up a Heritrix instance (REQUIRED for a crawl to complete).

```
wget https://s3-us-west-2.amazonaws.com/sleipnir-heritrix/heritrix-3.3.0-SNAPSHOT-dist.zip
unzip heritrix-3.3.0-SNAPSHOT-dist.zip
cd heritrix-3.3.0-SNAPSHOT-dist
./bin/heritrix -a admin:admin
```

Now Heritrix is running at https://localhost:8443 and can be accessed
with the username/pass : admin/admin.


Next, let us set up a simple crawl using clojure routines. 

We start with the imports:

```clojure
(ns sleipnir.demo
  "Dude this is the demo"
  (:require [net.cgrand.enlive-html :as html]
            [sleipnir.handler :as handler]
            [org.bovinegenius.exploding-fish :as uri])
  (:import [java.io StringReader]))
```

Say, I want to walk through reddit's pagination. We use
enlive selectors for our extractor code:

```clojure
(defn reddit-pagination-extractor
  "Pulls reddit pagination using enlive"
  [url body]
  (let [resource (-> body (StringReader.) html/html-resource)
        anchors  (html/select resource [:span.nextprev :a])]
    (filter
     identity
     (map
      (fn [an-anchor]
        (println an-anchor)
        (try (uri/resolve-uri url
                              (-> an-anchor
                                  :attrs
                                  :href))))
      anchors))))
```

Then, we want to store the submitted links in some location

```clojure
(defn reddit-submission-links-writer
  "Gets links to reddit submissions"
  [url body wrtr]
  (let [resource (-> body (StringReader.) html/html-resource)
        submissions (html/select resource
                                 [:p.title :a.title])
        links (filter
               identity
               (map
                (fn [an-anchor]
                  (try (uri/resolve-uri url
                                        (-> an-anchor
                                            :attrs
                                            :href))))
                submissions))]
    (doseq [link links]
     (binding [*out* wrtr]
       (println link)))))
```

And then set up and execute the crawl. The config object has a ton of
options (I'll flesh the documentation out soon). Several of these
options tweak Heritrix's settings.

```clojure
(handler/crawl {:heritrix-addr "https://localhost:8443/engine"
                :job-dir       "/Users/shriphani/Documents/reddit-job"
                :username      "admin"
                :password      "admin"
                :seeds-file    "/Users/shriphani/Documents/reddit-job/seeds.txt"
                :contact-url   "http://shriphani.com/"
                :out-file      "/tmp/bodies.clj"
                :extractor     reddit-pagination-extractor
                :writer        reddit-submission-links-writer})
```

In the config above, we specify where heritrix is launched, the job
directory, the payload directory and the extraction and writer routines.

The result is a heritrix job that walks through the pagination and dumps
the submitted links to `/tmp/bodies.clj`.

Here's a screengrab of the job:

<img src="/img/heritrix-sleipnir-demo.png" />

And here's a snapshot of the recorded submission links:

```
https://www.reddit.com/r/tifu/comments/2ys7wr/tifu_by_attempting_to_clean_the_kitchen/
http://uatoday.tv/politics/ukraine-calls-for-russian-documentary-on-crimea-to-be-sent-to-hague-tribunal-414713.html
https://www.reddit.com/r/Music/comments/2ys88r/check_out_our_free_ep_feathers_by_divide_of/
https://s-media-cache-ak0.pinimg.com/736x/19/f6/18/19f618637135ec676d0dfdcd4d23b542.jpg
http://imgur.com/HqG6Udq
https://www.reddit.com/r/Jokes/comments/2ys8a9/did_you_hear_about_the_nympho_waitress/
https://www.reddit.com/r/AskReddit/comments/2ys8bb/hey_reddit_what_is_a_great_classic_or_family/
http://imgur.com/qTKH4pA
...
...
```

Library: [https://github.com/shriphani/sleipnir](https://github.com/shriphani/sleipnir)
