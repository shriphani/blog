    Title: Carrots And Sticks: The Semantic Web and ReCAPTCHA
    Date: 2016-03-22T02:48:45
    Tags: internet, recaptcha, esp, schema.org, incentives

In 2014 I attended a talk by [Ramanathan V. Guha](https://en.wikipedia.org/wiki/Ramanathan_V._Guha) on [schema.org](http://schema.org/). Its remarkable adoption offers several lessons about building internet properties.

## A Machine-Readable Web

When we visit amazon's webpage, it is pretty clear to us that
we are looking at a set of products, their prices and that sort of thing.

TODO: add horse img

Unfortunately the markup used to generate this webpage contains none of this high-level information. It looks like this:

As you can see, you can't tell from the HTML you are looking at a product.

That information is gold - knowing that you're looking at a product and its price allows other programs to consume and do something with that data - say build a price-comparison tool.

Thinking along similar lines, a website that aggregates talks at nearby institutions could expose information that another program can use to say, notify you when a certain speaker is going to visit.

In short, placing this data in the markup would be amazing.

### The Technical Bits

What would such a system require? Obviously a standardized vocabulary. This ensures there is a dictionary everyone can refer to, consensus around what terms mean, and conventions established around their use.

So, a team needs to come up with a scheme that allows you to describe what is being rendered like blog articles, products, news items and whatnot.

Easy.

### User Base

A standard without adoption is not worth the paper it is printed on.

So how do you force users - in this case people who make websites, to adopt your vocabulary.

There are at least 4 standards that were invented since the semantic web buzzword came into existence. All but 1 barely feature on any reasonable number of sites on the web.

R.V Guha's team at Google set up the incentives right for adoption. A partnership involving the top 4 players in web-search in the US built [schema.org](http://schema.org). An ontology that devs could incorporate into their websites.

Schema.org annotations were then used to enhance how search results looked. Web search formed (and still forms) a significant chunk of traffic to the top sites on the internet. A website where machine-readable content was available would look more informative and look nicer.

A search result that sticks out leads to a noticeable bump in traffic (and possibly sales).

As of today, schema.org dwarfs every other vocabulary that can be used on the internet.

Setting up the incentives correctly was vital to making schema.org successful.