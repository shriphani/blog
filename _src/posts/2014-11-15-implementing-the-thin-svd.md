    Title: Implementing Truncated Matrix Decompositions for Core.Matrix
    Date: 2014-11-28T06:16:15
    Tags: clojure, core.matrix, machine-learning, svd, thin-svd,
    dimension-reduction, arpack, eigendecomposition

Eigendecompositions and Singular Value Decompositions appear in a
variety of settings in machine learning and data mining. The
eigendecomposition looks like so:

<div>
$$
\mathbf{A}=\mathbf{Q}\mathbf{\Lambda}\mathbf{Q}^{-1}  
$$
</div>

$ \mathbf{Q} $ contains the eigenvectors of $ \mathbf{A} $ and $
\mathbf{\Lambda} $ is a diagonal matrix containing the eigenvalues.

The singular value decomposition looks like:

<div>
$$
\mathbf{A} = \mathbf{U} \boldsymbol{\Sigma} \mathbf{V}^*
$$
</div>

$ \mathbf{U} $ contains the eigenvectors of the covariance matrix
$ \mathbf{A}\mathbf{A^T} $. $ \mathbf{V} $ contains the eigenvectors
of the gram matrix $ \mathbf{A^T}\mathbf{A} $.

The **truncated** variants of these decompositions allow us to compute
only a few eigenvalues(vectors) or singular values (vectors).

This is important since (i) a lot of times, the smaller eigenvalues
are discarded, and (ii) you don't want to compute the entire
decomposition and retain only a few of the rows and columns of the
computed matrices each time.

For core.matrix, I implemented these truncated decompositions in
[Kublai](http://github.com/shriphani/kublai). Details below.

<!-- more -->

For large matrices , on consumer grade hardware (like your laptop), it
is near impossible to compute a full decomposition. If your algorithm
performs a decomposition per iteration, then things get worse.

The excellent
[ARPACK library](http://www.caam.rice.edu/software/ARPACK/) implements
an efficient truncated SVD that is leveraged by several popular
numerical libraries like the popular Python library
[scikit learn](http://scikit-learn.org/stable/) and
[Apache Spark](https://spark.apache.org/).

**ARPACK's eigendecomposition is not tied to any particular matrix
 library.** You only need to supply a routine that multiplies a vector
 with the input matrix (which ARPACK uses for its
 [power-iteration](http://en.wikipedia.org/wiki/Power_iteration)
 step).

Clojure's budding matrix library <code>core.matrix</code> implements
both the eigen and singular value decompositions but doesn't contain a
truncated version.

In this post, I will describe how I used the ARPACK library to
implement these truncated decompositions for <code>core.matrix</code>.
The resulting implementation is independent of the particular
implementation of <code>core.matrix</code> being used.

While the details of the post are tied to <code>core.matrix</code>,
the lessons can be transferred to other numerical libraries in other
languages.

The excellent [netlib library](https://github.com/fommil/netlib-java)
provides a clean java interface to the ARPACK library (which is
implemented in FORTRAN).

I will assume that you have ARPACK installed on your machine. If so,
netlib will be able to invoke ARPACK.

### Truncated Eigendecomposition:

There are a symmetric eigendecomposition that I have currently
implemented (and a non-symmetric version is on the way).

Invoking the truncated eigendecompositon routine is trival:

* Call the
  <code>[DSAUPD](http://www.caam.rice.edu/software/ARPACK/UG/node136.html)</code>
  routine (for symmetric matrices. Use
  [DNEUPD](http://www.caam.rice.edu/software/ARPACK/UG/node137.html)
  for the opposite)
  till the <code>IDO</code> flag is set to 99.
  
* Once this is done, the eigen vectors and values can be retrieved by
  a call to
  <code>[DSEUPD](http://www.caam.rice.edu/software/ARPACK/UG/node40.html)</code>.
  The eigenpairs are returned in ascending order of eigenvalues.
  
And that's it. There are a few flags that tell you if there are fatal
errors which you need to check that the docs for <code>DSAUPD</code>
and <code>DSEUPD</code> contain.

### Truncated Singular Value Decomposition:

The truncated SVD can just invoke the eigendecomposition on the gram
and covariance matrices. No ARPACK calls are needed here.

The implementation for both the decompositions is available in this
[github repository](https://github.com/shriphani/kublai).


### Usage

This module can be used in the following fashion:

For computing symmetric eigendecompositions:

```clojure
user> (def M (matrix [[1 2 3 4]
                   [2 5 6 7]
                   [3 6 8 9]
                   [4 7 9 10]]))
#'user/M
user> (use 'kublai.core :reload-all)
nil
user> (eigs M 2 :symmetric) ;; compute 2 eigenvectors for this matrix
{:Q [[-0.22593827269074584 -0.4432218615090191 -0.5727878807113498 -0.6514754961809404] [0.7253136654558885 0.3184697313242928 0.1424607347013554 -0.5934661371986827]], :A [[24.06253512439672 0.0] [0.0 -0.8054849155764637]]}
user> 
```

For computing a truncated SVD:


```clojure
user> (def M (matrix [[1 2 3 4]
                   [5 6 7 8]
                   [9 10 11 12]
                   [13 14 15 16]]))
#'user/M
user> (svd M 2)
{:U [[-0.13472212372225584 0.8257420598345273] [-0.3407576960799602 0.4288172018031381] [-0.5467932684376645 0.03189234377176592] [-0.7528288407953688 -0.365032514259624]], :V* [[0.4284123959267892 0.4743725155726848 0.5203326352185806 0.5662927548644766] [0.7186534763126667 0.27380780936493887 -0.17103785758268963 -0.6158835245304229]], :S [[38.62265683187287 0.0] [0.0 2.0713230668787377]]}
user> (clojure.pprint/pprint (svd M 2))
{:U
 [[-0.13472212372225592 -0.825742059834525]
  [-0.34075769607996026 -0.42881720180314464]
  [-0.5467932684376648 -0.03189234377175876]
  [-0.7528288407953688 0.3650325142596215]],
 :V*
 [[-0.4284123959267895
   -0.4743725155726852
   -0.5203326352185804
   -0.5662927548644764]
  [-0.7186534763126535
   -0.27380780936497917
   0.1710378575827312
   0.615883524530409]],
 :S [[38.62265683187287 0.0] [0.0 2.0713230668787403]]}
nil
```

### Efficiency

In this example I shall demonstrate how valuable a truncated SVD is.
Say we have a very large matrix and we only need 10 singular
values/vectors. We will be using the
<code>[vectorz-clj](https://github.com/mikera/vectorz-clj/)</code>
implementation of <code>core.matrix</code>.

```clojure
(let [M1 (reshape (matrix (range 500000)) [10000 50])
        M2 (reshape (matrix (range 5000000)) [10000 500])
        M3 (reshape (matrix (range 5000000)) [1000 5000])]
    (time (kublai/svd M1 10))
    (time (kublai/svd M2 10))
    (time (kublai/svd M3 10)))
```

Here, <code>M1</code> is a 10000 x 50 matrix, <code>M2</code> is a
10000 x 500 matrix, and <code>M3</code> is a 1000 x 5000 matrix.

And the results are:

```
"Elapsed time: 17372.943 msecs"
"Elapsed time: 78085.404 msecs"
"Elapsed time: 41511.266 msecs"
```

Now say we had to run a full decomposition on these matrices (using
the standard stuff that ships with <code>core.matrix</code>), the
results look like:

```
"Elapsed time: 19617.777 msecs"
"Elapsed time: 157861.467 msecs"
"Elapsed time: 97627.002 msecs"
```

For the larger matrices this is nearly twice as long as the truncated
versions.

(Experiments on a Macbook Air with 8 GB of memory and a 1.8 Ghz i5).

### Links:

* [Kublai](http://github.com/shriphani/kublai) - The decompositions
  themselves
* [Kublai Timing Tests](http://github.com/shriphani/kublai-timing) -
  Tests to time these decompositions
