    Title: Powerful Ideas in Manifold Learning
    Date: 2014-11-02T05:10:47
    Tags: machine-learning, visualization, data-mining, data-science, isomap,
    manifold-learning, dimension-reduction, mds,
    multidimensional-scaling, pca

In a
[previous post](/2014/10/29/low-dimension-embeddings-for-visualization/),
I described the MDS (multidimensional scaling) algorithm. This
algorithm operates on a proximity matrix which is a matrix of
distances between the points in a dataset. From this matrix, a
configuration of points is retrieved in a lower dimension.

The MDS strategy is:

* We have a matrix $ D $ for distances between points in the data.
  This matrix is _symmetric_.
* We express distances as dot-products (using a proof from Schonberg).
  This means that $ D $ is expressed as $ X^T X $. (Observe that $ X^T
  X $ is a matrix of dot-products).
* Once we have $ X^T X $, dimension reduction is trivial. We know
  from
  [**PCA**](http://en.wikipedia.org/wiki/Principal_component_analysis)
  that we can run an eigendecomposition on this matrix and  retrieve a
  low-dimension embedding by discarding eigenvalues (eigenvectors).
  

Thus, assuming that we work with _euclidean distances_ between points,
we retrieve an embedding that PCA itself would produce. Thus, **MDS with
euclidean distances is identical to PCA**.

Then what exactly is the value of running MDS on a dataset?

First, the PCA is not the most powerful approach. For
certain datasets, euclidean distances do not capture the shape of the
underlying manifold. Running the steps of the MDS on a different
distance matrix (at least one that doesn't contain euclidean
distances) can lead to better results - a technique that the [Isomap
algorithm](http://en.wikipedia.org/wiki/Isomap) exploits.

Second, the PCA requires a vector-representation for points. In several situations,
the objects in the dataset are not points in a metric space (like
strings). We can retrieve distances between objects (say edit-distance for
strings) and then obtain a vector-representation for the objects
using MDS.

In the next blog post, I will describe and implement the Isomap
algorithm that leverages the ideas in the MDS strategy. Isomap
constructs a distance matrix that attempts to do a better job at
recovering the underlying manifold.

**PROOFS:**

* _Distances are dot-products:_
  [These notes from Peking U](http://www.math.pku.edu.cn/teachers/yaoy/Fall2011/lecture11.pdf)
  are easy to follow. I have mirrored them [here](/img/mds_proof.pdf) in case that link 404s.
