    Title: Accessing Your Kindle Highlights
    Date: 2013-07-21T04:34:14
    Tags: racket, functional-programming, kindle, kindle-api, kindle highlights, clojure

In 2010, I purchased my first Kindle and since then apart from GEB [<a href="#GEB" name="GEB-Back">1</a>], I haven't bothered with physical copies. The Kindle store satisfies most of my needs (I find situations where the paperback costs less than the digital copy and refuse to buy the book on principle).

The books can be read on any platform (OS X, iOS for iPad and iPhone in my case and I do remember a rather unpleasant Kindle app on WP7)

One of the benefits of a digital book is that it should be straightforward for me to collect a list of highlights I've made about the book. Amazon (in their infinite wisdom) have not provided an API in the 3 or so years I've used the Kindle ecosystem and manually transcribing the quotes is not something I am interested in doing. Scraping remains the only alternative. I decided to use clojure for this task.

<!-- more -->

For ClueWeb, I discarded the use of Selenium since running a browser impedes the crawler. Selenium is a good fit for this problem which can be summarized as:
<pre>
(logging into kindle.amazon.com -> downloading a list o of book-specific-s-expressions -> download highlights for desired book/author)
</pre>
The following routines accomplish that. I dump both to file since my list of books read does not grow by the second so it is feasible to work with a stale file.

<script src="http://gist-it.appspot.com/github/shriphani/clojure-kindle-highlights/blob/master/src/kindle_highlights/core.clj"></script>

I have a command line sequence around it. Details on the github repo wiki [<a href="#Github" name="Github-back">2</a>].
What would be more interesting is to make the filter a routine a bit better than a linear scan + regular expression match.

[<a name="GEB">1</a>] <a href="http://www.amazon.com/gp/product/0465026567/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0465026567&linkCode=as2&tag=shriswebl-20">Gödel, Escher, Bach: An Eternal Golden Braid</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=shriswebl-20&l=as2&o=1&a=0465026567" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> <a href="#GEB-Back" style="font-size:75%;">go-back</a>


[<a name="Github">2</a>] <a href="https://github.com/shriphani/clojure-kindle-highlights/">https://github.com/shriphani/clojure-kindle-highlights/</a> <a href="#Github-back" style="font-size:75%;">go-back</a>