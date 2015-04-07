    Title: The Smallest Eigenvectors of a Graph Laplacian
    Date: 2015-04-06T22:54:43
    Tags: machine-learning, spectral-learning, eigenvectors, spectral-analysis,
    clustering, partitioning, graph-partitioning, spectral-clustering, fiedler,
    fiedler-vector, dimension-reduction

Given a graph $ G = (V, E) $, its adjacency matrix $ A $ contains an entry at $
A_{ij} $ if vertices $ i $ and $ j $ have an edge between them. The degree
matrix $ D $ contains the degree of each vertex along its diagonal.

The graph laplacian of $ G $ is given by $ D - A $.

Several popular techniques leverage the information contained in this
matrix. This blog post focuses on the two smallest eigenvalues.

First, we look at the eigenvalue 0 and its eigenvectors. A very elegant result
about its multiplicity forms the foundation of spectral clustering.

Then we look at the second smallest eigenvalue and the corresponding
eigenvector. A slightly more involved result (YMMV) allows us to partition the
graph in question. A recent publication by John Urschel (who apparently
moonlights as a sportsperson) focused on this quantity.

The insights provided here sacrifice some rigor for the sake of brevity. I find
such descriptions help me study without getting bogged down too much with details. A
bibliography provided at the end contains links to actual proofs.

<!-- more -->

# Eigenvalue 0

## The Insight

The zero-th eigenvalue tells us whether the graph is connected or not.

In particular, if a graph has $ k $ connected components, then eigenvalue 0 has
multiplicity $ k $ (i.e. $ k $ distinct non-trivial eigenvectors).

A blueprint for the proof looks like this (detailed proof provided later):

* The eigenvector corresponding to eigenvalue 0 (known hereafter as $ \lambda_0
  $) must contain some non-zero entries - (this is established by showing that $
  L $ is positive semi-definite (psd)).
* In fact, if vertices $ i $ and $ j $ are connected, then components $ i $ and
  $ j $ in $ \lambda_0 $ must be equal.
* If the graph is connected, apply transitive property and you get an
  eigenvector where all the components are equal (or all components set to 1).
  
  This looks like so:
  <img src="/img/ev_all_ones.svg" />
  
* If the graph is not connected, then consider each connected component
  separately and run this procedure on it again. For $ k $ connected portions of
  the graph, we should have $ k $ distinct eigenvectors, each of which contains
  a distinct, disjoint set of components set to 1.
  
  So, if the graph has 2 connected components, then the eigenvalue 0 has 2
  non-trivial eigenvectors:<br />
  <img src="/img/several_evs.svg" />
  
  In the diagram above, the vertices 1, 2, and 3 form one connected component
  and vertices 0, 4, and 5 form the other component.
  
  A toy example illustrates this nicely.
  
  In this example, we have a graph with 6 vertices. Say the graph is connected.
  
  Let us see what the value of the desired eigenvector is $ < 1, 1, 1, 1, 1, 1 > $.
  
  For 2 connected components, this value possibly is $ < 1, 1, 1, 0, 0, 0 > and  < 0, 0, 0, 1, 1, 1 >  $
  
  And so on.
  
## From Eigenvectors to Clustering

The gist of the previous section is:

(i) The multiplicity of eigenvalue 0 equals the number of connected components.
(ii) If vertices $ i $ and $ j $ are connected, then in a certain eigenvector
corresponding to the eigenvalue zero, the $ i^{th} $ and $ j^{th} $ components
are set to 1.

The next task is to use these insights for clustering a set of points.

A simple strategy seems to be (i) constructing a graph from this point set, (ii)
ensuring that different clusters become different connected components in this
graph, and (iii) look at the eigenvectors of the first eigenvalue for some
assistance in discovering these clusters.

The first two steps are trivial. We can build a $ k $-NN graph - a graph where
each point in the dataset is a vertex and an edge exists between this point and
the $ k $ points closest to it.

So this diagram illustrates this setting. Let us say we have 6 points in the
dataset and 2 clusters.

Let us construct a $ k $-NN graph - I'm going to set $ k \leftarrow 2 $ (this is
for convenience). The $ k $-NN graph looks like:

<img src="/img/toy_knn.svg" />

Thus there are 2 connected components.

The insight from the previous section tells us that the eigenvalue 0 has
multiplicity 2 and the 2 distinct eigenvectors look like:

<img src="/img/toy_evs.svg" />

Consider a matrix with these eigenvectors as its columns:

<div>
$$
\begin{bmatrix}
1 & 0\\ 
1 & 0\\ 
1 & 0\\ 
0 & 1\\ 
0 & 1\\ 
0 & 1\\
\end{bmatrix}
$$
</div>

This matrix has as many rows as the original dataset.

It also has the effect of causing the clusters in the graph to pop out.

In this example, I can tell that the first three points belong in the same
cluster. The next three points form the second cluster.

If you supply this matrix to any classic clustering algorithm (say $ k $-means),
it should have no issues clustering this and assigning points to the correct
clusters.

This is exactly what spectral clustering does.

Thus the steps involved are:

* Construct a $ k $-NN graph (or indeed any other graph - say one that uses a
  threshold test on euclidean distances).
* Obtain the laplacian of this graph.
* Obtain the eigendecomposition of the laplacian, retain the first $ k $
  columns of the eigenvector matrix.
* Supply this matrix to $ k $-means (or your favorite clustering algorithm).

Spectral clustering deals well with non-convex cluster shapes because of the
underlying graph constructed. The manifold considered as a result captures the
shape of the clusters reasonably well - something we cannot accomplish if only
euclidean distances are used:

<img src="/img/non_convex.svg" />

This is a neat trick exploited by the
[isomap algorithm](http://blog.shriphani.com/2014/11/12/the-isomap-algorithm/)
which was covered in a previous post.

Constructing the graph tends to be a bit involved - often there isn't a clear
way to build one. The performance of spectral clustering depends on how the
connected components in the graph reflect clusters in the dataset.

A connected graph (which you can produce quite easily by picking a large $
k $) will yield poor results.

Despite these issues, spectral clustering is a very powerful and well-studied
technique and belongs in any practitioner's toolbox (IMO).

# Second Smallest Eigenvalue of the Laplacian

For the sake of brevity, I will call this quantity $ \lambda_1 $. I will call
the associated eigenvector $ v_1 $.

M. Fiedler in his landmark monograph called this quantity the algebraic
connectivity of a graph. $ \lambda_1 $ and its eigenvectors provide amazing
insights.

One of the insights is:

If $ \lambda_1 = 0 $ clearly eigenvalue 0 has multiplicity greater than 1. Thus
the graph is not connected.

This is fairly trivial to establish - the insight from the previous section
covers it.

The next insight, my favorite, involves partitioning a graph.

When we partition a graph (into say 2 partitions), we desire 2 reasonably large
groups of vertices with very few edges between them.

Observe that this exercise is a waste of time if the graph isn't connected
(there are already two distinct components with no edges between them). Thus it
makes sense to only consider connected graphs.

Let us try to give a formal shape to the partitioning problem.

Partitioning can be defined as assigning a value of $ +1 $ or $ -1 $ to each
vertex. Vertices with different assignments are in different partitions.

Say vertex $ v_i $ gets assigned value $ x_i $.

Let us assume a perfect paritioning. Exactly $ |V|/2 $ points are assigned and $
x_i = +1 $ and the other half assigned $ x_i = -1 $.

Now, a pair of vertices $ v_i $ and $ v_j $ that belong to _different
partitions_ are assigned values $ x_i $ and $ x_j $ where $ x_i \neq x_j
$. Thus, the only possible value for $ (x_i - x_j)^{2} $ is $ 4 $.

For each edge from one partition to the other, we have a value of 4. Thus, the
number of edges from one partition to the other is given by:

<div>

$$
\sum_{i=1, j=i}^{i=n, j=n} \frac{(x_i - x_i)}{4}
$$

</div>

Also, assuming a perfect paritioning, an equal number of vertices are assigned
values $ +1 $ and $ -1 $. Thus we have:

<div>

$$
\sum_{i} x_i = 0
$$

</div>

Our objective is to minimize the number of edges from one partition to the
other while achieving a reasonable size for each partition.

This can be expressed as the following optimization function:

Minimize
<div>
$$ 
\sum_{i=1, j=i}^{i=n, j=n} \frac{(x_i - x_i)}{4} 
$$
</div>
with the constraint 
<div>
$$ 
\sum_{i} x_i = 0 
$$ 
</div>.

This unfortunately has a trivial solution. Set all $ x_i $ to 0.

An additional constraint eliminates this problem. The new constraint is:

<div>

$$
\sum_{i} {x_i}^{2} = |V|
$$

</div>

We work with matrix variants of these equations. Clearly, the component
responsible for the number of edges looks like $ \frac{x^T \mathcal{L} x}{4} $.

The constraint that enforces reasonable partition sizes is $ x^T\mathcal{1} =
0$. Here $ \mathcal{1} $ is a vector of all ones.

Finally, the term responsible for ensuring a non-trivial solution is $ x^Tx =
|V| $.

And the lagrangian looks like:

<div>

$$

\nabla \frac{x^T \mathcal{L} x}{4} - \nabla \eta_1 (x^Tx - |V|) - \nabla \eta_2
(x^Te) = 0

$$
</div>

which becomes:

<div>

$$
\mathcal{L} x - \eta_1 x - \eta_2 \mathcal{1} = 0
$$

</div>

Multiply by $ \mathcal{1}^T $ on both sides:

<div>

$$
\mathcal{1}^T \mathcal{L} x - \eta_1 \mathcal{1}^T x - \eta_2 \mathcal{1}^T
\mathcal{1} = 0
$$

</div>

This essentially becomes:

<div>

$$
\mathcal{L}x - \eta_1x = 0
$$

</div>

Thus $ x $ is clearly an eigenvector of the graph laplacian and $ \eta_1 $ is an
eigenvalue.

Obviously, the eigenvector of the eigenvalue 0 doesn't work (it assigns the
value 1 to all points).

Clearly $ v_1 $ (the eigenvector of the second smallest eigenvalue) is a
solution (the intuition is that the smaller the eigenvalue, the fewer the edges
between the two partitions).

Thus, the eigenvector $ v_1 $ (a.k.a the Fiedler vector) provides an assignment
to each vertex in the graph. This assignment can be used to partition the graph.

There is just one issue here. The eigenvector contains real values, not
necessarily $ 1 $ and $ -1 $.

A whole host of tricks can be applied to convert the entries in the eigenvector
to $ +1 $ and $ -1 $:
<div>
<ul> 
<li> $ sgn(v_{1_{i}}) $ i.e. vertex $ i $ gets assigned a value $ x_i  = $ the
sign of the $ i^{th} $ component of the eigenvector $ v_1 $. </li>
<li> $ x_i = +1 $ if $ v_{1_i} > m $, $ -1 $ otherwise. Here $ m $ is the median of
  all the eigenvalue components (or the mean or zero or whatever). </li>
</ul>
</div>
  
And this is how the Fiedler vector helps with graph partitioning.

The bibliography attached to this post contains some amazing literature that I
had a lot of fun reading. I have mirrored these documents in github and provided
the github link.

# Bibliography

1. [A Tutorial on Spectral Clustering](/docs/Luxburg07_tutorial.pdf) - Ulrike
von Luxburg - A self-contained and elaborate tutorial on spectral clustering.
2. [Algebraic Connectivity of Graphs](/docs/Algebraic_Connectivity.pdf) -
Miroslav Fiedler - A landmark paper on the properties of the second smallest
eigenvalue and its associated eigenvector
3. [Partitioning Sparse Matrices with Eigenvectors of Graphs](/docs/Pothen89Partition.pdf) -
Alex Pothen, Horst Simon, Kang-Pu Paul Liu - An algorithm to leverage the
  Fiedler vector for graph Partitioning




