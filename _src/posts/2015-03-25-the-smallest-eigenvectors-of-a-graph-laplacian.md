    Title: The Smallest Eigenvectors of a Graph Laplacian
    Date: 2015-03-25T23:07:43
    Tags: machine-learning, spectral-learning, eignevectors

Say that $ D $ is the degree matrix (degrees along the diagonal) for a certain graph $ \mathcal{G} $ 
and $ W $ is its adjacency matrix. A simple un-normalized graph laplacian is the matrix $ D - W $.

Its smallest eigenvalues(vectors) contain an enormous amount of information. For instance, the multiplicity
of the eigenvalue 0 gives us the number of connected components - a fact leveraged by spectral clustering.

The second smallest eigenvector (for a connected graph at least) can be leveraged to partition the graph.
This eigenvector (a.k.a the Feidler vector) received its 15 seconds of fame after the Ravens' lineman 
published a paper on the subject.

This blog post will explore these two quantities and cover a monograph and a paper I had a lot of fun
reading.

<!-- more -->

# The Smallest Eigenvalue - 0:

The multiplicity of the eigenvalue zero gives us the number of connected components in a graph. The proof
proceeds as follows:

* The graph laplacian is PSD.
* As a result, if you have a fully connected matrix, the zero-th eigenvalue has the vector of all 1s as
its eigenvector.
* For $ k $ connected components, there are $ k $ such eigenvectors with chunks set to 1.

# The Second Smallest Eigenvalue:

For 
