    Title: Augmenting enlive
    Date: 2014-05-16T01:14:56
    Tags: clojure, enlive, htmlcleaner, scraping

In manipulating HTML documents for features, I find myself needing to
use some operations all the time - removing script tags, comments and
the like. This feature-set is available in HtmlCleaner and I thus
merged the two libraries to produce <code>enlive-helper</code>.

Now you can do:

```clojure
(html-resource-steroids 
 (java.io.StringReader. "<html><body><a>hi</a></body></html>") 
 :prune-tags "a")
```

And as a result the <code>a</code> tag is not picked up:

```clojure
({:tag :html,
  :attrs nil,
  :content
  ("\n"
   {:tag :head, :attrs nil, :content nil}
   "\n"
   {:tag :body, :attrs nil, :content nil})})
```

The options you can pass mirror those of [HtmlCleaner](http://htmlcleaner.sourceforge.net/parameters.php). Full docs
available in [this github repo](https://github.com/shriphani/enlive-helper).

Also, the code is something I threw together from my research so it is
released under [Matt Might's CRAPL license](http://matt.might.net/articles/crapl/CRAPL-LICENSE.txt).
