    Title: Learning and Understanding Distances
    Date: 2015-06-01T20:58:43
    Tags: machine-learning, data-mining, metric-learning, distances, mahalanobis, mahalanobis-distance

Not knowing how near the truth is, we seek it far away. - Hakuin Ekaku

Computing the distance between two points is a fundamental operation in machine
learning.

The $ k $-NN classifier retrieves $ k $ points closest to a (test) point and returns
a value based on these points (the maximum-frequency variable, or an average of some statistic ...)

The $ k $-means algorithm constructs clusters whose centers are close to cluster members.
Each iteration perturbs the existing configuration slightly; in each perturbation
distances between a cluster-center and cluster-members are used to refine
an existing configuration.

There are several traditional distance metrics that we can readily apply to a pair of points.
Some popular choices are the euclidean and cosine distances.

The euclidean distance is the length of a line-segment between two points.

The cosine distance relates to the angle between the position vectors of the given points.

Despite their popularity, for reasons I will elaborate on soon, the euclidean distance is quite
likely to be stumped in a high dimensional space.

Thus being able to tweak a distance function with the help of supervision
is rather convenient.

The mahalanobis distance offers such a framework.

In this blog post, I will establish the intuition behind this quantity.

Then, I will cover a fairly recent result that allows to tune this distance function - the LMNN
algorithm.

<!-- more -->

