    Title: Carrots And Sticks: The Semantic Web and ReCAPTCHA
    Date: 2016-03-22T02:48:45
    Tags: internet, recaptcha, esp, schema.org, incentives

In 2014 I attended a talk by [Ramanathan V. Guha](https://en.wikipedia.org/wiki/Ramanathan_V._Guha) on [schema.org](http://schema.org/). Its remarkable adoption offers several lessons about building internet properties.

Then we cover an amazing project called ReCAPTCHA.

## A Machine-Readable Web

When we visit amazon's webpage, it is pretty clear to us that
we are looking at a set of products, their prices and all that.

TODO: add horse img

Unfortunately the markup used to generate this webpage contains none of this high-level information.

That information is gold - knowing that you're looking at a product and its price allows other programs to consume and do something with that data - say build a price-comparison tool.

Thinking along similar lines, a website that aggregates talks at nearby institutions could expose information that another program can use to say, notify you when a certain speaker is going to visit.

### The Technical Bits

What would such a system require? Obviously a standardized vocabulary. So that there is a dictionary everyone can refer to and consensus around what terms mean, conventions established around their use.

So, a bunch of people who do this sort of stuff for a living come up with a scheme that allows you to describe what something is in a way that other programs can consume and process it.

Easy.

### User Base

A standard without adoption is not worth the paper it is printed on.

So how do you force users - in this case people who make websites, to adopt your vocabulary.

There are at least 4 standards that were invented since the semantic web buzzword came into existence. All but 1 barely feature on any reasonable number of sites on the web.

R.V Guha's team at Google set up the incentives right for adoption. A partnership involving the top 4 players in web-search in the US built [schema.org](http://schema.org). An ontology that devs could incorporate into their websites.

And the real piece of the puzzle, schema.org annotations were used to enhance how search results looked. Web search formed (and still forms) a significant chunk of traffic to the top sites on the internet. A website where machine-readable content was available would look more informative and look nicer.

A search result that sticks out leads to a noticeable bump in traffic (and possibly sales).

As of today, schema.org dwarfs every other vocabulary that can be used on the internet.

## 