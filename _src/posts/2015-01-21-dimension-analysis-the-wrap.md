    Title: Dimension Analysis: The Wrap
    Date: 2015-01-21T22:31:29
    Tags: clojure, machine-learning, data-mining, dimension-reduction,
    mds, pca, kernel-pca, isomap

In the past few blog posts, I covered some details of popular
dimension-reduction techniques and showed some common themes. In this
post, I will collect all these materials and demonstrate the motivation
for each of the techniques I covered. Clojure code based on
<code>core.matrix</code> is provided for all the algorithms covered
(github repo shared at the end of the blog post).

<!-- more -->

### Dimension?

The best definition I've seen for the topic comes from Benoit
Mandelbrot's work on
[fractal geometry](http://en.wikipedia.org/wiki/Fractal_Dimension). The
fractal dimension is associated with the ability of a pattern to fill
space. Here's a good example to illustrate what we mean.

Consider this cuboid (prism with a rectangle base):

<img src="/img/cuboid.png" />

Say this cuboid has uniform density. Now, at a microscopic level, we
begin observing. How do we observe? Assume that a there's a sphere
around you (the observer). Now, let this sphere expand a bit. At the
microscopic level, your sphere encounters more of the cuboid's
material in all 3 dimensions.

<img src="/img/cuboid_microscope.png" />

Now, at a slightly different scale, when our sphere expands, we observe
more material in only 2 dimensions.

<img src="/img/cuboid_2d.png" />

On a scale like the one in the next pic, we encounter no material at
all.

<img src="/img/cuboid_zero.png" />

An intuitive explanation of why scale matters is provided in this
Wikipedia example. Using a ruler of different lengths, we obtain
different measures for the coastline of Great Britain. At various levels
of scale, we acquire various measures of the coastline - using a ruler
that is as long as the diameter of the earth, the coastline of britain
is a negligible fraction of our instrument.

<img src="http://upload.wikimedia.org/wikipedia/commons/7/78/Britain-fractal-coastline-200km.png" />
<img src="http://upload.wikimedia.org/wikipedia/commons/c/c8/Britain-fractal-coastline-100km.png" />
<img src="http://upload.wikimedia.org/wikipedia/commons/f/f9/Britain-fractal-coastline-50km.png" />

There's a neat formula that can be used to estimate the fractal
dimension of a dataset:

* $ n $: The number of pairs of points in our data.
* $ r $: The radius of a sphere centered around the observer.

The estimate of the fractal dimension is given by $ \log(n) / \log(r) $.

On plotting this value for the cuboid example, we should observe a curve
like this:

<img src="/img/fractal_dim_cuboid.jpg" />

(Sorry about the ghetto plot).

### Curve of your 
