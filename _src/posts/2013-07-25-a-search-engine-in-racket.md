    Title: A Search Engine in Racket
    Date: 2013-07-25T13:09:34
    Tags: 

The title is not completely true. Only a portion of the engine is written in Racket - the other portion is in ANSI C (I will elaborate).

Since I moved to Frog, I had two options for search:

* Google Custom Search[1]

* Lucene[2]

I am not interesting in using option 1 since I would like the binary to last on my server. Lucene is implemented in Java and seems too heavyweight to me.

Recently, Don Metzler[3] mentioned a lightweight, real-time search engine on Quora called Whistlepig[4]. From the website:

* It is real-time.
* It is implemented in less than 3000 lines of ANSI C.

This makes it a very nice foundation for implementing retrieval models on top of it. Also, ANSI C allows me to use the Racket FFI so I can write the retrieval model in Racket and leave the less interesting bits to Whistlepig. In this blog post, I will walk through the BM25 Implementation and the installation in Frog.

<!-- more -->

## Compiling Whistepig

### OS X
I had to make a few modifications to make Whistlepig compile on OS X. You can grab it from [this github branch](https://github.com/shriphani/whistlepig/tree/osx_compile) (The diff: [https://github.com/shriphani/whistlepig/compare/osx_compile](https://github.com/shriphani/whistlepig/compare/osx_compile)).

After compiling it with <code>make</code>, we need to obtain a <code>.dylib</code> file. 

### Linux
I was able to compile a clone of the default repo without any modifications at all on Ubuntu 12.04 (that runs on this web-server). Henceforth, I will assume that the environment is Linux (because I've used it).

## Talking to Whistlepig with Racket
First we need a shared object (a <code>.so</code> (Linux), or a <code>.dylib</code>). We can build one by doing:
<pre>
	gcc --shared
</pre>

Once that is done, we can check if we can talk to Whistlepig from Racket. This set of routines builds and index and then searches it.

<!-- github-link -->

The corpus I used is and the query is:

## BM25 Walkthrough and Implementation
I will spend some time talking about the BM25 retrieval model. There are three components:

* IDF
* Query Term
* TF Term

I do not have a large enough labeled corpus to do a parameter sweep. I will just use the values mentioned in the paper. These is no reason to assume these numbers won't work.

These rather trivial routines can be expressed as so in Racket:

<!-- code segment from github -->

Next, we need to make a web-service out of this so we can have a search box that accepts queries and renders results. This is trivially accomplished by a simple racket web application that hooks up to the index and web-server in question.

Now, you have a search engine on your site that is written in lisp (sort-of) and allows you to have full control of the retrieval model. Whistlepig weighs in at under 3000 lines of ANSI C and the racket layer on top takes about x lines of code. In this small a set-up we have a decent enough implementation. 