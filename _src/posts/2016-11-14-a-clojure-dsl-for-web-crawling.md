    Title: A Clojure DSL for Web-Crawling
    Date: 2016-11-16T01:00:20
    Tags: clojure, web-crawling, dsl, crawling, scraping

When building crawlers, most of the effort is expended in guiding them through a website. For example, if we want to crawl all pages and individual posts on this blog, we extract links like so:

1. Visit current webpage
2. Extract pagination links
3. Extract link to each blog post
4. Enqueue extracted links
5. Continue

In this blog post, I present a new DSL that allows you to concisely describe this process.

This DSL is now part of this crawler: [https://github.com/shriphani/pegasus](https://github.com/shriphani/pegasus) 

<!-- more -->

Enlive provides an idiomatic way to select elements and it forms the foundation of most of the work here. Let us implement the crawler I discussed above:

Since the focus (in this blog post at least) in on extracting links, let us look at the DSL:

```clojure
(defextractors
  (extract :at-selector [:article :header :h2 :a]

           :follow :href

           :with-regex #"blog.shriphani.com")
                       
  (extract :at-selector [:ul.pagination :a]

           :follow :href
                                
           :with-regex #"blog.shriphani.com"))
```

And that is it! We specified an elive selector to pull tags, the attribute entry to follow and then filter these URLs with a regex.

With [pegasus](https://github.com/shriphani/pegasus), the full crawler is expressed in under 10 lines as:

```clojure
(defn crawl-sp-blog-custom-extractor
  []
  (crawl {:seeds ["http://blog.shriphani.com"]
          :user-agent "Pegasus web crawler"
          :extractor (defextractors
                       (extract :at-selector [:article :header :h2 :a]

                                :follow :href

                                :with-regex #"blog.shriphani.com")
                       
                       (extract :at-selector [:ul.pagination :a]

                                :follow :href
                                
                                :with-regex #"blog.shriphani.com"))
          
          :corpus-size 20 ;; crawl 20 documents
          :job-dir "/tmp/sp-blog-corpus"}))
```

Essentially, under 20 lines.

The DSL was partially inspired by the great work done in this crawler for Node.js: [https://github.com/rchipka/node-osmosis](https://github.com/rchipka/node-osmosis)

Links:
<!-- Place this tag where you want the button to render. -->
[Pegasus](https://github.com/shriphani/pegasus): <a class="github-button" href="https://github.com/shriphani/pegasus" data-icon="octicon-star" data-style="mega" data-count-href="/shriphani/pegasus/stargazers" data-count-api="/repos/shriphani/pegasus#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star shriphani/pegasus on GitHub">Star</a> 

<div>
<!-- Place this tag in your head or just before your close body tag. -->
<script async defer src="https://buttons.github.io/buttons.js"></script>
</div>