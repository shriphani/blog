    Title: Subotai: Data Mining for HTML Documents
    Date: 2014-06-24T10:32:27
    Tags: clojure, html, data-mining, near-duplicate-detection, structural-similarity

I spent the last few months studying and implementing some routines
that take a raw HTML document (or documents) and do stuff with it
(them). [Subotai](https://github.com/shriphani/subotai) is a library that consolidates some of these routines.
In this blog post I will describe what is currently implemented and
what the roadmap is.

<!-- more -->

## Structural Similarity

Dynamic web-pages are built by populating templates and thus two pages
that look the same, possibly share the same underlying template.
Structural similarity measures the similarity of the underlying
templates. Subotai contains an implementation of the Restricted
Top-Down Mapping algorithm (which I shall call RTDM) - a dynamic
programming algorithm which measures the Tree-Edit-Distance (rather
like its cousin that works on strings). You can use the subotai
implementation like so:

For the following two documents (which clearly look the same and as we
can guess use the same underlying HTML template):

<table>
    <tr>
    	<td><img src="/img/blog_page_1.png" style="display:inline" /></td>
	    <td><img src="/img/blog_page_2.png" style="display:inline"/></td>
	</tr>
</table>

you can do this with Subotai:

```clojure
user=> (use 'clj-http.client)
user=> (use 'subotai.structural-similarity.core :reload)
user=> (def bod1 (:body (get "http://blog.shriphani.com/"))) ; this is page 1
#'user/bod1
user=> (def bod2 (:body (get "http://blog.shriphani.com/index-2.html"))) ; this is page 2
#'user/bod2
user=> (similar? bod1 bod2)
true ; both pages have the same structure
user=>
```

## Near-Duplicate Detection

One can often find pages on the web that are near duplicates of each
other - for instance a page on a site mirror vs the actual
destination. I have an example here of two web-pages that are not
identical but near-identical:
[the first](http://www.kidneyspace.com/index.php/topic,5286.msg30719.html)
and [the second](http://www.kidneyspace.com/index.php/topic,5286).

The two documents differ in the templating slightly and have dates and
other meta content that is slightly different. You can test it using:

```clojure
user> (use 'clj-http.client)
WARNING: get already refers to: #'clojure.core/get in namespace: user,
being replaced by: #'clj-http.client/get
user> (use 'subotai.near-duplicate.core :reload)
user> (def b2 (:body (get "http://www.kidneyspace.com/index.php/topic,5286.msg30719.html")))
#'user/b2
user> (def b1 (:body (get "http://www.kidneyspace.com/index.php/topic,5286")))
#'user/b1
user> (near-duplicate-html? b1 b2)
true
user> 
```

## Links

The github project page:
[[github: Subotai]](https://github.com/shriphani/subotai)

PDFs of the papers implemented:
[[github: Papers]](https://github.com/shriphani/subotai/tree/master/doc)

## Pipeline

Next, I want to implement record detection (automatically figuring out
different reviews on an amazon product page for instance).

The thresholds used are picked from papers or 2-fold cross validation.
I will move that codebase into Subotai later.
