    Title: Racket Whistlepig Bindings
    Date: 2013-08-27T01:12:00
    Tags: racket, ffi, racket-ffi, search, real-time, retrieval

Whistlepig is a lightweight real-time search engine written in ANSI C.
([description](http://masanjin.net/whistlepig/) and [source](https://github.com/wmorgan/whistlepig))
I heard about it when Don Metzler plugged it in an answer he wrote on
quora. In this post, with very little code, I was able to build
an index, query it and write a servlet that talks to the index using
the FFI.

<!-- more -->

Whistlepig is implemented in less than 3000 lines of ANSI C. It comes
with a very decent query language and returns documents (that match a
query) sorted by their time-of-insertion (into the index).

For using the FFI, we need a shared
library. I had to modify the Makefile slightly to make it compile on
OS X (you can download this from my fork [here](https://github.com/shriphani/whistlepig/tree/osx_compile)). I was able to build it
on Linux with ease though. You can build the <code>.so</code>
(<code>.dylib</code>) file using the following command:

<script src="https://gist.github.com/shriphani/6355004.js"></script>

On OS X, you will need to replace the <code>.so</code> with <code>.dylib</code>.

In order for the generated <code>libwhistlepig.so</code> file to be
picked up the Racket FFI, you will need to add the directory where it
resides to the environment variable <code>LD_LIBRARY_PATH</code>.

Next, we need to use the FFI and write racket functions that call the
corresponding Whistlepig routines. This file is sufficient to wrap
around all this routines we will need to use.

<script src="https://gist.github.com/shriphani/6350939.js"></script>

Let us now test our implementation. Whistlepig itself ships with two
programs: <code>add</code> and <code>query</code>. <code>add</code>
adds a bunch of files specified on the command line to a new index. We
can replicate the functionality in <code>add.rkt</code>:

<script src="https://gist.github.com/shriphani/6350956.js"></script>

<code>interactive.rkt</code> takes and index location and interactively runs
queries against it and returns doc-ids. This is <code>interactive.rkt</code>.

<script src="https://gist.github.com/shriphani/6350962.js"></script>

Now, the next step is obviously very straightforward. I wanted a quick
way to get set up and running. We don't have things like stored-fields
in Lucene so, we need an external map to doc-ids. I am using a file
that contains a list of <code>s-expressions</code> that look like
this:

<code>
(doc-id doc-path doc-title doc-link)
</code>

On my laptop (not accessible from the public web), the file looks
like:

<script src="https://gist.github.com/shriphani/6358032.js"></script>

So, our search engine will start, load the documents and add them to
the index in the order specified.

When a query comes along, we get the doc-ids from the engine and line
them up with the document title (and thus we get the doc-link that can be rendered).

We accept queries using a URL of the form
<code>http://domain/search?q=query</code>. This tiny servlet accomplishes
that:

<script src="https://gist.github.com/shriphani/6358046.js"></script>

You can try it out here : [http://blog.shriphani.com/search?q=hello](http://blog.shriphani.com/search?q=hello). It is very clunky and only indexes my blog's
post pages. . It won't generate snippets (the postings list doesn't store
token positions).

To make this really work, I will need to integrate it with Frog and
flesh the UI out. This
was something I threw together quickly so I could build on it later.
It ended up being a good excuse to continue using the FFI. The
whistlepig bindings are quite sparse too and can use some work.

The full code is available in [this Github repository](https://github.com/shriphani/racket-whistlepig).
