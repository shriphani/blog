    Title: Low Dimension Embeddings for Visualization
    Date: 2014-10-29T23:15:52
    Tags: mds, clojure, data-science, representation, visualization, incanter

Representation learning is a hot area in machine learning. In natural
language processing (for example), learning long vectors for words has
proven quite effective on several tasks. Often, these representations
have several hundred dimensions. To perform a qualitative analysis of
the learned representations, it helps to visualize them.
Thus, we need a principled approach to drop from this high dimensional
space to a lower dimensional space (like $ \mathbb{R}^2 $ for
instance).

In this blog post, I will discuss the Multidimensional scaling (MDS) algorithm - a manifold
learning algorithm that recovers (or at least tries to recover) the
underlying manifold that contains the data. 

MDS aims to find a configuration in a lower-dimension space that
preserves distances between points in the data. In this post, I will
provide intuition for this algorithm and an implementation for clojure (incanter).

<!-- more -->

MDS works by preserving distances between points in the data. The end
result of running this algorithm on a dataset is a spatial arrangement
that preserves distances (to the best of its ability).

For example, say you learn a representation for words - like word2vec.
These representations are continuous vectors of 300 elements (at least
the default vectors are). These representations preserve (or exhibit) some striking
linguistic phenomena. For instance, $ R(man) - R(woman) \approx
R(king) - R(queen) $. Words that are semantically similar tend to have
similar representations.

So how does one go about visualizing phenomena like these? Clearly,
you want to be able to view these points in 2 dimensions (on a plot
say) and also preserve some of the properties (i.e. similarity of
semantically similar words).

MDS operates on pairwise distances between data points. It retrieves
an embedding of the data-points in a lower-dimensional space that
preserves these distances. Thus, we can visualize the representations
learned by using MDS to drop down to 2 dimensions. Ideally the
distances should be preserved. Perfect.

Here is an implementation for clojure (using <code>core.matrix</code> - I had to
set the implementation to <code>vectorz</code> since svd seems to not be available by default):

```clojure
(ns clojure-manifold.mds
  "Implementation of MDS"
  (:refer-clojure :exclude [* - + == /])
  (:require [clojure.core.matrix :refer :all]
            [clojure.core.matrix.operators :refer :all]
            [clojure.core.matrix.linear :refer :all]))

(set-current-implementation :vectorz)

(defn double-center
  "Double centering:
   0.5 * (matrix - row-mean - col-mean + grand-mean)"
  [a-matrix]
  (let [row-sum (apply + a-matrix)
        col-sum (->> a-matrix transpose (apply +))

        [num-rows num-cols]  (shape a-matrix)
        
        row-mean (->> (/ row-sum num-rows)
                      (repeat num-rows)
                      matrix)
        col-mean (->> (/ col-sum num-cols)
                      (repeat num-cols)
                      matrix
                      transpose)

        grand-mean (+ (/ (reduce + row-sum)
                         (* num-rows num-cols))
                      (new-matrix num-rows num-cols))]

    (* -0.5
       (-> a-matrix
           (- row-mean)
           (- col-mean)
           (+ grand-mean)))))

(defn proximity-matrix
  "Construct a proximity matrix (of euclidean distances)"
  [a-matrix]
  (map
   (fn [x]
     (map
      (fn [y]
        (Math/pow (distance x y)
                  2))
      a-matrix))
   a-matrix))

(defn mds
  "Take a matrix and find a configuration in n dimensions
   that preserves directions"
  [a-matrix n]
  (let [D (proximity-matrix a-matrix)
        centered-D (double-center D)
        {U :U
         S :S} (svd centered-D)]
    (* (submatrix U 1 [0 n])
       (submatrix S 0 n 0 n))))
```


I will test these on a few word-vectors from [word2vec](https://code.google.com/p/word2vec/). The words in
question are:

```
river
lake
city
town
actor
doctor
dog
cat
animal
home
```

The word vectors for these words are available in
[foo.csv](/img/foo.csv).

I then ran MDS on this matrix like so:

```
user> (use 'clojure-manifold.mds :reload)
nil
user> (def M (load-data "foo.csv"))
#'user/M
user> (save-csv (mds M 2) "foo-reduced.csv") ; reduce to 2 dimensions
```

The plot looks like so:

<iframe
src="https://docs.google.com/spreadsheets/d/1yDeqAtGh_7kHvmsdLGsCzFMwFno1iJ9fn7zVqkToVoI/pubchart?oid=762847171&amp;format=interactive"
style="width:100%;height:50vh;"></iframe>

Looking at this plot, we observe that the resulting configuration
places semantically similar words close by. For instance <code>{dog,
cat, animal}</code>, <code>{home, actor, doctor}</code>, <code>{lake,
river}</code> and <code>{city, town}</code> are groups that are
clustered together and the individual clusters are pretty far away from
each other.

In a later blog post, I will work through the proof.

The source code for MDS is available in this repo: [https://github.com/shriphani/clojure-manifold](https://github.com/shriphani/clojure-manifold)
