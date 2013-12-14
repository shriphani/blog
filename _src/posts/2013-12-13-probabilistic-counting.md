    Title: Probabilistic Counting
    Date: 2013-12-13T23:12:33
    Tags: loglog, flajolet, probabilistic-counting

I recently got my hands on the common-crawl URL dataset from
[here](https://archive.org/details/2013_common_crawl_index_urls) and
wanted to compute some stats like the number of unique domains
contained in the corpus. This was the perfect opportunity to whip up a
script that implemented Durande et. al's
[log-log paper](http://algo.inria.fr/flajolet/Publications/DuFl03.pdf).

<!-- more -->

The algorithm operates on a stream and produces an estimate for the
cardinality of the input stream. Here's the algorithm itself:

```clojure
(ns probabilistic-counting.log-log
  "The LogLog algorithnm"
  (:use [incanter.core])
  (:import [org.apache.mahout.math MurmurHash]
           [org.apache.commons.lang3 SerializationUtils]))

(defn rho
  "Number of leading zeros in the bit-representation
   Args:
    y : the number itself
    size : optional : the number of bytes used to represent
           the number. Default: 4 bytes/32 bits"
  ([y] (rho y 32))
  
  ([y size]
     (int
      (- size
         (Math/ceil
          (/ (Math/log (+ y 1))
             (Math/log 2)))))))

(defn alpha
  [m]
  (if (< 64 m)
    0.79402
    (* 2 (Math/pow (* (gamma (- (/ 1 m)))
                      (/ (- 1 (Math/pow 2 (/ 1 m)))
                         (Math/log 2)))
                   (- m)))))

(defn log-log
  [xs k]
  (let [m       (int (Math/pow 2 k))
        buckets (make-array Integer/TYPE m)]

    (do
      (map #(aset buckets % 0) (range m))
      (doseq [x xs]
        (let [h   (int (MurmurHash/hash (SerializationUtils/serialize x) 1991))
              idx (bit-and h (- m 1))
              val (max
                   (aget buckets idx)
                   (rho h))]
          (aset buckets idx val)))
      (* (Math/pow 2 (/ (apply + buckets) m))
         m
         (alpha m)))))

```

And here's a test (actual cardinality = 1,000,000):

```clojure
(defn demo-log-log []
  (log-log
   (map #(mod % 1000000) (range 10000000)) 10))
```

When run, we get:

```
user> (demo-log-log)
1023513.5806580923
```

which is an error of 2.3%.

Now, let us deploy it on the URL dataset. There are 2,412,755,840
URLs in the format: <code>host_reversed/path/scheme</code>. The
following piece of code constructs the host stream and estimates the
cardinality.

```clojure
(ns probabilistic-counting.demo-urls
  "Estimate the number of unique domains in the Common crawl dataset"
  (:use [probabilistic-counting.log-log]))

(defn urls-stream
  [url-file]
  (-> url-file
      clojure.java.io/reader
      line-seq))

(defn hosts-stream
  [url-stream]
  (map
   #(first (clojure.string/split % #"/"))
   url-stream))

(defn count-hosts
  [a-hosts-stream]
  (log-log a-hosts-stream 10))

(defn -main
  [& args]
  (let [path     (first args)
        num-urls (when (second args)
                   (-> args second Integer/parseInt))]
    (if num-urls
      (->> path urls-stream hosts-stream (take num-urls) count-hosts)
      (->> path urls-stream hosts-stream count-hosts))))

```

On a portion of the dataset, these are the results:

Using standard unix tools (<code>uniq</code> works here without a sort
because the dataset is already sorted by hostname):

```
➜  probabilistic_counting git:(master) ✗ cat ~/common_crawl_index_urls | head -n 50000 | cut -d "/" -f 1 | uniq | wc -l
9205

➜  probabilistic_counting git:(master) ✗ cat ~/common_crawl_index_urls | head -n 500000 | cut -d "/" -f 1 | uniq | wc -l
22164

➜  probabilistic_counting git:(master) ✗ cat ~/common_crawl_index_urls | head -n 5000000 | cut -d "/" -f 1 | uniq | wc -l
196318

➜  probabilistic_counting git:(master) ✗ cat ~/common_crawl_index_urls | head -n 50000000 | cut -d "/" -f 1 | uniq | wc -l
1525445
```

And log-log produces:

```
➜  probabilistic_counting git:(master) ✗ lein trampoline run ~/common_crawl_index_urls 50000
9677.974613035705

➜  probabilistic_counting git:(master) ✗ lein trampoline run ~/common_crawl_index_urls 500000
22708.710878857888

➜  probabilistic_counting git:(master) ✗ lein trampoline run ~/common_crawl_index_urls 5000000
194919.74158794453

➜  probabilistic_counting git:(master) ✗ lein trampoline run ~/common_crawl_index_urls 5000000
1602155.9911824786
```

And the accuracy is really very good.

This algorithm works since:

* $ \rho(x) $ computes the position of the LSB in $ x $.
* The probability that $ \rho(x) $ is $ k $ is $ \frac{1}{2^k} $ (the
  probability of obtaining a sequence of $ k - 1 $ zeroes and a one).
* Say, the real cardinality is $ n $. Thus, on $\frac{n}{2^k}$ members of
  this set, $ \rho(x) $ will yield a value of $ k $.
* As a result, if you can drive $ 2^k $ as close to $ n $ as possible,
  you have a good estimation of cardinality. This is achieved by
  maximizing $ k $.
* And thus, $ \arg\max_{x \in M} \rho(x) $ is an estimator (albeit
  biased) for $ \log(n) $.
  
This is one of those extremely sweet papers where the idea (minus the
details) fits on a business card and the resulting algorithm has
immense practical value.

The full source code is available in [this github repository](https://github.com/shriphani/probabilistic-counting).
