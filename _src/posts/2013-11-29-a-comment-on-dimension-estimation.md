    Title: A Comment on Dimension-Estimation
    Date: 2013-11-29T23:49:33
    Tags: dimension-reduction, dimension, grassberger-procaccia, k-nn-classifier

I saw this neat comment in a paper I was recently reading. If you have
all <code>i.i.d</code> features and you want to estimate its dimension
using Grassberger-Procaccia (which estimates dimension using a
distance-based metric) or want to classify using a k-NN classifier, it
is bad if the data points are mostly pairwise equidistant (for
instance, a correlation integral plot will look like a step function
and thus will be useless; a k-NN classifier will break because the
test point ends up equidistant from all the existing points).

There is a trivial argument using the Hoeffding bound in Chris Burges'
[paper] [] that suggests that if the features are all
<code>i.i.d</code>, a majority of pairwise distances will end up
clustered tightly around a mean which means that k-NN or
Grassberger-Procaccia won't work well. I am going to repeat this
argument here so I can remember it for later:

Our vectors are of dimension $ d $ and the components are $ \pm1 $.
Assuming all the components are $ iid $, the Hoeffding bound gives us:

$$ P(|\|| x_{1} - x_{2} \||^{2} - 2d| > d\epsilon) = P(| x_{1} \cdot x_{2} | > d\epsilon/2) \le 2exp(-\frac{d\epsilon^2}{8})$$

and this shows us that most pairwise distances will end up clustered
very tightly around a mean and this means that a majority of pairs of
points in the dataset will end up equidistant and thus a $ k-NN $
classifier will fail.

This also means that the correlation integral is a good way to
determine if a k-NN classifier will work well. If the plot resembles a
spike, the distance function needs to change.

The correlation-integral is an immensely powerful tool and [here's] [2] an implementation

[paper]: http://research.microsoft.com/en-us/um/people/cburges/tech_reports/msr-tr-2009-2013.pdf
[2]: https://github.com/shriphani/clj-dimension/blob/master/src/clj_dimension/estimation/correlation_integral.clj
