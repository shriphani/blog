    Title: A Beautiful Gift With Clojure and LaTeX
    Date: 2015-06-29T14:20:33
    Tags: clojure, latex, pdf, religion, books, generate

For my parents' 26th anniversary, I decided to convert an online
religious text they read into a beautiful, well-typeset book.

The online text was built by volunteers using an archaic version
of Microsoft Word and looks like this:

<img src="/img/toc.png" width="300px"/> <img src="/img/ch1.png" width="300px"/>

Anyone who has read science or math literature is exposed to the high-quality
output LaTeX produces.

Fortunately LaTeX's abilities extend far beyond the domain of mathematical
symbols.

I was able to combine Clojure's excellent HTML processing infrastructure
([enlive](https://github.com/cgrand/enlive)) and LaTeX to produce a nice looking document.

The entire process took a few hours.

Here are two pages from the final output:

<embed src="/img/sample_chapter.pdf" height="1000px" type='application/pdf' />

This blog post contains latex and clojure snippets to produce that output.
I am not good at designing books or combining typefaces and would appreciate
advice.

<!-- more -->

### The LaTeX Pieces

The inspiration for this book came from this [TeX StackExchange thread](http://tex.stackexchange.com/questions/1319/showcase-of-beautiful-typography-done-in-tex-friends).

A user was working on replicating a 16th century bible (img from LaTeX Stack Exchange):

<img src="http://i.stack.imgur.com/ipf9I.png" width="300px"/>

Using that piece as inspiration, I converged on the following theme:

1. A garamond typeface - I think they fit the theme of religious texts quite well.
Fortunately a nice package [ebgaramond](http://www.georgduffner.at/ebgaramond/) makes it easy to typeset your entire document in this beautiful font.

```latex
\usepackage{ebgaramond}
```

is all you need to put in your LaTeX document.

2. Liberal use of ornaments on page-borders, special pages etc.

The [pgfornament](http://altermundus.com/pages/downloads/packages/pgfornament/ornaments.pdf) package comes with very beautiful ornaments. When combined with TikZ,
a seasoned user can create very sophisticated and professional documents.

I am not a seasoned user so I was perfect satisfied with using something
out-of-the-box. Each page in the book was going to have these ornaments in the
page-corners:

<img src="/img/pg-corner.png" style="text-align:center"/>

The pgfornaments package combined with [eso-pic](https://www.ctan.org/pkg/eso-pic?lang=en) allows you to achieve exactly that.

```latex
\makeatletter
\AddToShipoutPicture{%
  \begingroup
  \setlength{\@tempdima}{2mm}%
  \setlength{\@tempdimb}{\paperwidth-\@tempdima-2cm}%
  \setlength{\@tempdimc}{\paperheight-\@tempdima}%
  \put(\LenToUnit{\@tempdima},\LenToUnit{\@tempdimc}){%
    \pgfornament[anchor=north west,width=2cm]{63}}
  \put(\LenToUnit{\@tempdima},\LenToUnit{\@tempdima}){%
    \pgfornament[anchor=south west,width=2cm,symmetry=h]{63}}
  \put(\LenToUnit{\@tempdimb},\LenToUnit{\@tempdimc}){%
    \pgfornament[anchor=north east,width=2cm,symmetry=v]{63}}
  \put(\LenToUnit{\@tempdimb},\LenToUnit{\@tempdima}){%
    \pgfornament[anchor=south east,width=2cm,symmetry=c]{63}}
  \endgroup
}
\makeatother
```
Next, I decided that each chapter would begin at a new-page.

Chapter numbers and subtitles (if any) would be adorned above
and below with ornaments. Essentially I was going for:

<img src="/img/ch_landing.png" />

Note that the ornaments in the corner are the result of eso-pic.

The borders in the north, south, east and west, and the styling around
the chapter title are accomplished by:

```latex
\newpage
  \newgeometry{left=0cm,bottom=0cm,top=0cm,right=0cm}
  \begin{tikzpicture}[remember picture, overlay]
  \node[anchor=north] at (current page.north){\pgfornament[width=6cm,symmetry=h]{46}};
  \node[anchor=south] at (current page.south){\pgfornament[width=6cm]{46}};
  \node[anchor=north,rotate=90] at (current page.west){\pgfornament[width=6cm,symmetry=h]{46}};
  \node[anchor=north,rotate=-90] at (current page.east){\pgfornament[width=6cm,symmetry=h]{46}};
  \node[inner sep=6pt] (chapter) at (current page.center){\Huge Chapter I};
    \node[inner sep=12pt, below of=chapter, text width=10cm, align=center, outer sep=12pt] (title1) { };
  \node[inner sep=12pt, below of=title1, text width=10cm, align=center, outer sep=12pt] (title) { Salutations -- The Story of Grinding Wheat and Its Philosophical Significance};
  \node[anchor=north] at (title.south){\pgfornament[width=5cm]{60}};
  \node[anchor=south] at (chapter.north){\pgfornament[width=5cm,symmetry=h]{49}};
  \end{tikzpicture} 
\newpage

\restoregeometry
```

This forms the template for the book. Next, we populate the contents.

### The Clojure Pieces

Enlive is a fantastic HTML parsing library for clojure. The hierarchical
structure of HTML is captured in a clojure map:

<img src="/img/enlive-example.png" />

To transform a single chapter, we traverse this map (tree) and transform the
text as is appropriate. This is governed by where in the document the text
occurs.

After manually inspecting a few chapters, I made a small table that mapped
root - leaf paths in the DOM to handlers that would transform the text.

In clojure this can be succintly described as so:

```clojure
(defn convert-chapter-parse
  ([a-map]
   (->> (convert-chapter-parse a-map [])
        flatten
        (apply str)))

  ([a-map parent-path]
   (let [current-node-path (conj parent-path
                                 (if (= (:tag a-map)
                                        :body)
                                   [(:tag a-map)]
                                   [(:tag a-map) (:attrs a-map)]))
         node-contents (:content a-map)]

     (map
      (fn [an-item]
        (if (map? an-item)
          (convert-chapter-parse an-item
                                current-node-path)
          (let [fixed-item (-> an-item
                               (StringEscapeUtils/unescapeHtml3)
                               (string/replace #"\&"
                                               (Matcher/quoteReplacement "\\&")))]
            (format-content fixed-item
                            current-node-path))))
      node-contents))))
```

Essentially you keep track of where you are in the tree (relative to the root
element) and then fetch a function from a table that transforms your text
appropriately.

The table itself looks like this:

```clojure
   [[:body] [:p nil]]
   identity

   [[:body] [:p nil] [:font {:size 5}]]
   identity

   [[:body] [:p nil] [:b nil]]
   (fn [text]
     (str "\\section*{" text "}"))
```

Simple.

Run this on the entire book and I managed to have a neatly typeset book [hosted here](http://shriphani.com/book.pdf).

### Remarks

While a seemingly simple exercise (under 100 lines of code), html
allows you to get the same output with different templating. I noticed
that converting 10 chapters at a time and inspecting the batch for quirks
was a better approach for measuring coverage.

LaTeX isn't particularly fond of how HTML, MS Word etc use / handle double
quotes, apostrophes and so on. I have a couple of string/replace functions
but it clearly wasn't enough to deal with the entire book. This is a problem
that can only be solved by actually reading the book.

Overall, this turned out to be a really appreciated gift.