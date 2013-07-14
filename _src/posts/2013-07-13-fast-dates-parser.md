    Title: Fast dates parser
    Date: 2013-07-13T23:12:59
    Tags: research, clueweb12++, data processing

The Clueweb12++ crawl aims at accumulating social media content from the Clueweb crawl's time frame. Our pipeline thus far was as follows:

1. Download a bunch of index pages from forums (index pages link to threads).
2. Identify posts that fall in the time-frame specified.
3. Download posts and recreate web-graph to give the impression of a crawl completed in the 2012 time-frame.

There is one complicated time-frame in this setup - step 2. Dates processing is a nuisance that I would not wish upon anyone else. There are an innumerable number of surface representations (that can be ambiguous) and to add to our troubles, people do stuff like use "Last Week" to indicate time of activity.

The most accurate tool is SUTime but on a crawl the size of ClueWeb, it is foolish to run such a crawl on it. So what we do is use [Natty](http://natty.joestelmach.com/). Natty is fast and reasonably accurate.

I've uploaded a java module to github that will spit out a list of dates. You can obtain it [here](https://github.com/lemurproject/clueweb12pp-core/tree/master/pageTimes).