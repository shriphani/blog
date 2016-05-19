    Title: fort-knox: A disk-backed core.cache implementation
    Date: 2016-05-18T01:09:25
    Tags: clojure, lmdb, core.cache

[`core.cache`](https://github.com/clojure/core.cache) is a small and convenient cache library for clojure. It enables clojure users to quickly roll out caches. In this blog post I am going to describe a clojure implementation which stores cache entries to disk: [fort-knox](https://github.com/shriphani/fort-knox).

In a few recent projects I've needed a cache with entries backed to disk. This is a vital requirement in applications that need to be fault-tolerant. [LMDB](https://symas.com/products/lightning-memory-mapped-database/) (which I've had very positive experiences with) is fast, quick and perfect for this task. [`fort-knox`](https://github.com/shriphani/fort-knox) implements the `core.cache` spec and stores entries in LMDB. [`clj-lmdb`](https://github.com/shriphani/clj-lmdb) (subject of a previous blog post) is part of the plan now.

Note that this library deviates slightly from suggestions for `core.cache` implementations. For instance, the backing store doesn't implement [`IPersistentCollection`](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/IPersistentCollection.java) or [`Associative`](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/Associative.java) so `fort-knox` might deviate from expected behavior. Thus YMMV.
