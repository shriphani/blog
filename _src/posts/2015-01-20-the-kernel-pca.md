    Title: The Kernel PCA
    Date: 2015-01-20T21:28:09
    Tags: machine-learning, kernel-pca, pca, dimensions,
    dimensions-reduction

The Kernel PCA is an extension of the PCA algorithm. In particular, we
desire to (i) transform our existing dataset to another high-dimensional
space and then (ii) perform PCA on the data in that space.

In this blog post, I will perform a very quick, non-rigorous overview of
Kernel PCA and demonstrate some connections between other forms of dimension-reduction.

Why would this be useful? Consider this dataset (stolen from the
scikit-learn documentation):

<img src="http://scikit-learn.org/stable/_images/plot_kernel_pca_001.png" />

As we can see, the original PCA projection is fairly useless. Applying a
kernel produces a much better projection.

Like kernels in several problems, the trick is to avoid transforming
data-points and leveraging dot-products.

The technique is as follows:

$ \Phi $ is a mapping from our existing point-space to a
higher-dimensional space $ \mathcal{F} $.

After a certain amount of linear algebra, the PCA in space $ \mathcal{F}
$ can be expressed as a PCA on the [kernel matrix](http://en.wikipedia.org/wiki/Kernel_method).

So, the algorithm is expressible as follows:

* Compute the kernel matrix $ K $ where $ K_{ij} = \Phi(x_i) \cdot \Phi(x_j) $.
  
* This matrix is efficiently constructed since we can obtain the
  constituent dot products in the original space.
  
* The SVD of $ K $ gives you $ USV^{T} $ - $ U $ and $ S $ can be used
  to construct a reduced dimension dataset.
  
Now that the intro is out of the way, I wanted to demonstrate some
simple connections between algorithms I've covered recently:

### MDS with Euclidean Distances

In
[previous blog posts](http://blog.shriphani.com/2015/01/15/multidimensional-scaling-and-pca-are-the-same-thing/),
we covered that MDS and PCA are equivalent. A simple proof exists to
show that MDS and Kernel PCA are the same thing:

* The proximity matrix in the MDS algorithm is built with
  distances. We can express distances between vectors $ x $ and $ y $ as:
  
  <div>
  $$ d(x,y) = x \cdot x + y \cdot y - 2x \cdot y $$
  </div>
  
* Thus, distances can be expressed as a kernel. The upshot of this is
  that the MDS algorithm itself is an instance of Kernel PCA.
  
### Isomap

The Isomap algorithm (covered in a
[previous post](http://blog.shriphani.com/2014/11/12/the-isomap-algorithm/))
trades the Euclidean distance with edge weights in a nearest neighbor
graph. The entries in this proximity matrix are surrogates for distances
and thus the Isomap algorithm is an instance of Kernel PCA as well.

It is amazing how several different approaches to dimension-reduction
are variants of a single theme.




