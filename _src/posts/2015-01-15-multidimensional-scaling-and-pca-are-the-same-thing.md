    Title: Multidimensional Scaling and PCA are the Same Thing
    Date: 2015-01-15T21:13:37
    Tags: machine-learning, dimension-reduction, pca, mds,
    multidimensional-scaling, principal-components, eigenvalues

There is a very simple argument that shows that MDS and PCA achieve the
same results.

This argument has 2 important components. The first of these shows that
an eigendecomposition of a gram matrix can be used for
dimension-reduction.

PCA leverages the singular value decomposition (SVD). Given a matrix $ X $,
the SVD is $ X = USV^{T} $.

We drop columns from X by using $ US_{t} $ where we drop some rows and
columns from S.

This is also conviently obtained using an eigendecomposition of the
covariance matrix.

Working with the gram matrix, we have $ XX^{T} $ and when expressed in
terms of $ U $, $ S $ and $ V $, we have $ XX^{T} $ = $ (USV^{T})(VSU^{T}) $.

Simple algebra tells us that this is equal to $ US^{2}U^{T} $. The
[spectral theorem](http://inst.eecs.berkeley.edu/~ee127a/book/login/l_sym_sed.html) tells us that this the eigendecomposition of the gram
matrix will return this decomposition. $ U $ and $ S $ can be retrieved
and a dataset with fewer dimensions can be obtained. 

The second part of the argument involves proving that a matrix of
distances is indeed a gram matrix. This argument was discussed in a
[previous post](http://blog.shriphani.com/2014/11/02/powerful-ideas-in-manifold-learning/).


