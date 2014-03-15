    Title: Modifying The Heritrix Web Crawler
    Date: 2014-03-13T01:59:07
    Tags: java, heritrix, crawling, web-crawling

This is a post I wrote to teach myself about Heritrix and modifying
it. There are solid motivations for modifying web-crawlers since pure
BFS doesn't always cut it. In this post, I will modify two routines
that are central to web-crawling - extracting URLs from a webpage.

<!-- more -->

## Extractor

First, I am going to put together a simple extractor in Heritrix. This
extractor uses an XPath (I used a very trivial XPath for the sake of
this example). I use the HtmlCleaner library for parsing the supplied
HTML and then used the XPath classes that ship with java (I have
personally found that most Html parsing libraries bundle partial XPath
implementations and I typically use more complex queries for my
research so I prefer dealing with the <code>org.w3c.xml.dom</code>
documents.

This is what the extractor class looks like. It is super simple:

<script src="https://gist.github.com/shriphani/9574641.js"></script>

Now, to see it in action, you need to create a Heritrix job and
specify that this is the extractor you want to use. I have a test job
that crawls my blog. A heritrix job contains a configuration file
where you can specify the extractors and some other details (seed
links and all that). In this file, I specified the extractor class
like so:

```
<bean id="extractorHtml" class="org.archive.modules.extractor.XPathExtractor">
```

(incidentally the entire file looks like <a
href="https://gist.github.com/shriphani/9574658">this</a>).

I was subsequently able to process a webpage and all that without too
much fuss. In the near future, I plan to describe some of the more
interesting stuff I've been able to do with heritrix.
