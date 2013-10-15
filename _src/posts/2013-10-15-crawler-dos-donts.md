    Title: Web Crawling - Dos and Don'ts
    Date: 2013-10-15T04:22:44
    Tags: research, itsy, crawling

For my SIGIR submission I have been working on finding efficient
traversal strategies while crawling websites.

Web crawling is a straightforward graph-traversal problem. My research
focuses on discarding unproductive paths and preserving bandwidth to
find more information. I will write a post on it once I have my ideas
fleshed out and thus that won't be the focus of this post.

Here, I will describe the finer details needed to make your crawler
polite and robust. An impolite crawler will incur the wrath of an admin and might
get you banned. A crawler that isn't robust cannot survive the
onslaught of quirks that the WWW is full of.

<!-- more -->

<h3> Programming Environment </h3>

I do not believe it is worthwhile to iterate and formulate your ideas
on a large and complicated web-crawler. Heritrix is good for
large-scale crawling exercises but I would really not undertake the
task of manipulating its insides for testing simple hypotheses.

Clojure makes the JVM dynamic - this allows one to leverage the
high-quality libraries the Java enjoys while working in a repl.
Clojure is my go-to language for my research and I hope to be able to
keep using it forever.

<h3> Politeness </h3>

Crawlers need to be polite. Politeness means one must adhere to the
various ways in which websites can restrict how crawlers behave. I use
the following rules of thumb:

* Maintain a delay between successive requests to a web-server.
  Heritrix by default uses the formula: 
  <code> response_time * 1.5 </code>. 
  You can specify minimum and maximum intervals as well
  and then work with that. I typically wait 3 seconds between
  requests.
  
* Adhere to whatever robots.txt says. Seriously.

* Do not follow anchor tags containing the <code>rel="nofollow"</code>
  attribute.
  
<h3> Regexes are not always the answer </h3>

While it is tempting to use regexes to do things like discovering
subdomains, I would personally recommend that one use the tried and
tested approach called DNS. Make a request to fetch the DNS, type A or
AAAA record for a new or unknown host. I personally don't bother with
the AAAA record (I am not sure what chunk of the internet bothers with
IPV6). Most languages have a DNS module that will do all the right
things for you.

If DNS fails, it is possible the hosts file contains an address. I
generally do not bother with this as well.

<h3> Malicious Links Paths </h3>

> Never attribute to malice that which is adequately explained by stupidity.
- Hanlon's Razor

Not every hyperlink you are allowed to follow should be followed. It
is very easy for a webserver to dispatch responses using code like
this:


```
path_segments <- url.split("/")
return id_page_table[last(path_segments)]
```

This means that an entire path string is being ignored and only the
last path segment determines the response. This is a symptom of that
disease we call SEO-friendliness. This essentially means that:


* foo.bar.com/this/is/a/path/segment/123456

* foo.bar.com/this/is/another/path/segment/123456

* foo.bar.com/this/is/yet/another/path/segment/123456

will lead to the server returning the exact same response. If the
webpage has some dynamic feature like the time of the day, the
responses won't be identical (requiring you to employ shingles or
somesuch to detect near-duplicate content).

It is tempting to think that this problem cannot affect one at all.
Wrong. I was bitten by it on a website where the generated HTML's
links contained path segments appended to the end of the current URL.

After a certain period of time, you would begin seeing a list of URLs
that looked like:

* foo.bar.com/this/is/a/path/segment/123456

* foo.bar.com/this/is/a/path/segment/path/segment/123456

* foo.bar.com/this/is/a/path/segment/this/is/a/path/segment/123456

The net result was that the site generated a ton of URLs and dominated
the downloaded list.

This is a problem that will bite you, Heritrix can be configured to
discard URLs where the path segments repeat several times. This
will minimize damage.

Tracking repeating path segments is not a sufficient condition in and
of itself. I once had a site append some uniquely generated string (I
can only wonder why) to the end of my requests and it set off into an
infinite 301 redirect chain. You can specify how many 301 redirects
you are willing to tolerate. This also brings me to my next point:

<h3> Expose Critical Data-Structures </h3>

The WWW is insane. You cannot account for all the quirks that exist.
You can only respond to situations as they materialize. This means at
some point you will need to remove URLs from your crawler's frontier
(a fancy word for a <code>to-visit</code> queue).

In the lisp world this is trivial to achieve. Your repl provides you
access to all the critical data-structures. A small DSL will easily
suffice. Heritrix provides a REST API and accepts Groovy scripts (This
is the best one can do with a language like Java) that can access some
data structures. In any moderately sized crawl (at least 10-million
documents), I have been forced to use this.

If I think of any other pitfalls, I will put them here.
