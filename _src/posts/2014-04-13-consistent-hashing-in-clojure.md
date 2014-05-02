    Title: Consistent Hashing in Clojure
    Date: 2014-05-01T19:31:35
    Tags: clojure, consistent-hashing, hotspots

I wrote this post to teach myself consistent hashing - a simple hash
family that Akamai's founders came up with. This was originally done
to prepare for a talk in my grad algorithms class (I made a horlicks
of the talk but whatever). I am going to provide intuition, analysis
and a clojure implementation.

<!-- more -->

## The Problem Setting

A server contains viral resources (frequently hit webpages) and is swamped with requests. The
obvious solution is to replicate this page using a set of caches (a
set because a single cache can be overwhelmed by the same traffic surge) and
after a cache miss, we send the request to the server. 

We employ consistent hashing to assign and retrieve resources from
these caches.

The set of caches is not fixed and even the set of caches a client can
observe is not fixed. So one would like to be at the sweet spot of
redundancy and uniformity (i.e. an even distribution of items among caches). Add to this, the requirement that we
cannot predict a traffic surge.

The natural solution is thus to use hashing to determine which cache
to use to store a resource (or which cache to retrieve a resource
from). A traditional hash function of the type $ (ax + b) \\% p $ is a
poor choice since anytime $ p $ changes (which is quite often), the
entire assignment of resources changes and we are stuck with a
massive reassignment overhead.

Consistent hashing achieves all these properties and has
the added advantage of being quite simple.

Anywho the operations are:

* Get a circle of circumference 1.

* Take your items and map them to some point on this circle (using
  something like MD5).

* Then take the available caches (i.e. whatever you can see) and map
  them to the circle as well.
  
* To assign an item to a cache, start at the item, keep going
  clockwise and the first cache you hit is the one you assign the item
  to.
  
And that is it!
([this blog](http://www.tomkleinpeter.com/2008/03/17/programmers-toolbox-part-3-consistent-hashing/)
post has a few good graphics illustrating this algorithm).

Now, I wanted to perform a simulation of this algorithm in clojure to
see empirically how good the performance is. I basically simulated 100
assignments. This experiment essentially can be thought of as: 100
caches, 10000 items and the routine that assigns an item to a cache
updates its assignment ten times - each time observing a (random) subset of the
available caches. This is a distribution of the load:

<img src="/img/load.gif" />

Essentially the the size of the circle is an indication of the number
of items assigned. A very large circle indicates that a large number
of items were mapped to that cache. As you can see, only a few caches
have been overloaded with resources (possibly because one of the
workers picked up very few caches and mapped a lot of resources to
them).

Clearly the empirical evidence shows that the distribution of
resources in these caches is really good. Only a few caches out of 100
have an extraordinarily high number of resources assigned to them.
That experiment and the displayed gif were generated using code in
[this repo](http://github.com/shriphani/consistent-hashing).

In particular, the code for consistent hashing looks like:

```clojure
(ns consistent-hashing.core
  (:require [digest])
  (:import [java.nio ByteBuffer]))

(def items (range 10000))

(def caches (range 100))

(defn map-to-unit-circle
  [x]
  (let [arr (ByteBuffer/allocate 4)
        val (do (.putInt arr x)
                (->> arr
                     (.array)
                     digest/md5
                     (.getBytes)
                     bigint))]
    (double
     (/ (rem val 100000)
        100000))))

(defn map-cache-to-unit-circle
  [x]
  (let [val
        (->> x
             str
             digest/md5
             (.getBytes)
             bigint)]
    (double
     (/ (rem val 100000)
        100000))))

(defn assign-item
  [[item pt] caches-points]
  (let [dsts (sort-by
              second
              (map
               (fn [[c p]]
                 [c (if (< p pt)
                      (+ p (- 1 pt))
                      (- p pt))])
               caches-points))]
    (first
     (first dsts))))

(defn assign
  "Items: a set of items
   Caches: a set of caches"
  [items caches]
  (let [mapped-items  (into
                       {}
                       (map
                        vector
                        items
                        (map map-to-unit-circle items)))
        mapped-caches (sort-by
                       second
                       (map
                        vector
                        caches
                        (map map-cache-to-unit-circle caches)))]
    (map
     (fn [x]
       (assign-item x mapped-caches))
     mapped-items)))

(defn random-take
  [coll n]
  (let [coll-set (set coll)
        item (rand-nth (into [] coll-set))]
    (if (zero? n)
      []
      (cons item
            (random-take (clojure.set/difference coll-set (set [item]))
                         (dec n))))))

(defn simulation
  []
  (let [num-assgns 100]
    (map
     (fn [i]
       (let [to-take (rand-nth (range 1 (count caches)))
             seen-caches (random-take caches to-take)]
         (assign items seen-caches)))
     (range num-assgns))))

```

And the gif was generated using:

```clojure
(ns consistent-hashing.animate
  (:require [consistent-hashing.core :as core])
  (:import [javax.swing JFrame JLabel]
           [java.awt.image BufferedImage]
           [java.awt Graphics Dimension Color]
           [gifAnimation GifEncoder]))

(defn paint-canvas [size graphics caches assignment]

  ;; draw the unit circle
  (.setColor graphics (Color. 255 255 255))
  (.fillRect graphics 0 0 (+ 10 size) (+ 10 size))
  (doseq [[c x] caches]
    (.setColor graphics (Color. 255 0 0))
    (when (assignment c)
      (let [diam (+ 10 (/ (assignment c)
                          250))]
        (.fillOval graphics
                   (+
                    (/ size 2)
                    (- (/ diam 2))
                    (int (* (/ size 2) (Math/cos (* x
                                                    2
                                                    Math/PI)))))
                   (+
                    (/ size 2)
                    (- (/ diam 2))
                    (int (* (/ size 2) (Math/sin (* x
                                                    2
                                                    Math/PI)))))
                   diam
                   diam))))
  (.drawOval graphics
             0
             0
             size
             size))

(defn draw [size caches assignment]
  (let [image  (BufferedImage. (+ 10 size) (+ 10 size) BufferedImage/TYPE_INT_RGB)
        ;; canvas (proxy [JLabel] []
        ;;          (paint [g] (.drawImage g image 0 0 this)))
        ]

    (paint-canvas size (.createGraphics image) caches assignment)
    
    ;; (doto (JFrame.)
    ;;   (.add canvas)
    ;;   (.setSize (Dimension. (+ 10 size) (+ 10 size)))
    ;;   (.show))
    image))

(defn animate-load
  []
  (let [mapped-items (map vector
                          core/items
                          (map core/map-to-unit-circle core/items))
        mapped-caches (map vector
                           core/caches
                           (map core/map-cache-to-unit-circle core/caches))
        simulated (core/simulation)

        load-pics 
        (map
         (fn [xs]
           (reduce
            (fn [acc [c is]]
              (merge-with +' acc {c (count is)}))
            {}
            xs))
         (reductions
          (fn [acc x]
            (let [cache-items (reduce
                               (fn [acc [c is]]
                                 (merge-with clojure.set/union acc {c (set is)}))
                               {}
                               (map vector x (map vector core/items)))]
              (merge-with clojure.set/union acc cache-items)))
          {}
          simulated))

        encoder (new GifEncoder)]
    ;;(draw 800 mapped-caches load-pics)
    (.start encoder "load.gif")
    (.setRepeat encoder 0)
    (doseq [assignments (rest load-pics)]
      (println assignments)
      (let [img (draw 500 mapped-caches assignments)]
        (.addFrame encoder img)))
    (.finish encoder)))

```

Next, I will provide a proof of the claims made about consistent
hashing.

The paper suggests that there are 3 dimensions to a good distribution
of items in caches:

* Monotonicity

* Spread

* Load

* Balance

Let us see each of these properties in detail:

## Monotonicity

Essentially, when new caches are added, a resource can get mapped only
to one of the new caches but can't be mapped to an existing cache
(this clearly limits the amount of remapping you will engage in).

## Spread

This property ensures that a single item is not mapped to too many
caches (thus ensuring that items are evenly spread across the set of
caches).

We could empirically see the evidence for this in the gif above. The
proof of this metric has the following flavor:

* Assume that items are uniformly distributed on the circle.

* An arc length of $ O(\log{n}) $ on this circle contains a cache with
  very high probability (demonstrated using a simple Chernoff bound
  application that is available in the original paper).
  
* Stemming from this, we can be sure that, you don't have to travel
  far from an item to hit a cache.
  
* From that very lemma, you can also conclude that not too many caches
  lie in a small interval around the item.
  
* Use the union bound and you get a nice probability expression for
  the spread. i.e. with a high probability, you get a good spread.
  
## Load

Load guarantees that a single cache doesn't contain too many items
(again the evidence for this is available in the gif above).

The proof is identical to the proof for the spread case (just switch
the items with the caches).

## Balance

Balance ensures that overall, the probability that an item is mapped
to a cache is uniform (ish) across all caches.

Essentially a chernoff bound gives you a uniform distribution.

Consistent hashing is pretty much everywhere (memcached, Akamai, etc.
etc.) and is one of the all time greats of computer science.
