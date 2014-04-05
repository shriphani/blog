    Title: Clojure/Java String trim
    Date: 2014-04-05T16:07:52
    Tags: clojure, java, quirks, guava

Java's string <code>trim</code> routine tests for whitespace using
<code>Character.isWhitespace</code> and so does Clojure's
<code>clojure.string/trim</code>.

While processing a dataset off the web containing unicode space
characters, the trim routine failed to do anything useful. Luckily,
[a StackOverflow thread](http://stackoverflow.com/questions/1437933/how-to-properly-trim-whitespaces-from-a-string-in-java)
suggested using a routine from [Google's guava library](https://code.google.com/p/guava-libraries/). So in Clojure,
you can do this:

```clojure
(.trimFrom CharMatcher/WHITESPACE %)
```

and this will do the job.
