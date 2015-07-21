    Title: A New Weapon In The Fight Against Syphilis
    Date: 2015-07-21T02:31:26
    Tags: combinatorial-group-testing, group-testing, dorfman, syphilis, groups, testing, mathematics, tamper-proofing

The American war effort in WW2 was characterized by one of the largest compulsory
drafts in history. A staggering 50 million men were registered and nearly 10 million
inducted.

There was just one problem. Circa 1940, we didn't know how to mass-produce penicilin and
contraceptives weren't considered an important public health tool. Syphilis - which earned
the moniker The Great Imitator (owing to the wide variety of symptoms that victims
exhibited), claimed 6 out of every 100,000 deaths. In fact, a mere 20 years before - in the 20s -
Syphilis earned a spot among the top 10 killers in the US.

These conditions meant that every inductee was subjected to a blood test - a
brutal exercise in logistics for a rapidly expanding military.

Robert Dorfman, a Harvard economist, produced an elegant process to cut down
on the number of blood tests needed and in the process produced a seminal paper
in the field of group testing.

In this post, we'll derive the results from that paper - which as you'll observe
boils down to simple algebra.

Today, group testing is leveraged in several domains. We'll look at one such application
 of this technique that solves a neat problem in cryptography.

<!-- http://www.cdc.gov/nchs/data/vsus/vsrates1940_60.pdf -->


<!-- more -->

<div class="img-caption-center" style="padding-above:40px;">
     <img src="/img/nude_picasso.jpg" style="padding-bottom:10px" /> <br />
     Nude, Green Leaves and Bust - Pablo Picasso
</div>


### Group Testing and Syphilis


<div class="img-caption" style="padding-bottom:10px">
  <img src="/img/dorfman_portrait.jpg" width="50%" /> <br />
  Robert Dorfman - portrait from The Harvard Gazette
</div>

The traditional syphilis test is administered on an individual's blood sample.

In a scheme where we test each individual for an infection, on a population
of $ N $ individuals, we have no choice but to perform $ N $ tests. Let us call
this the naive scheme (NS).

_So a scheme that improves upon this, must involve fewer than $ N $ tests._

To exploit group testing our problem needs to have the following
characteristics:

* Only a fraction of the population's constituents are infected.
* Testing a group does not involve significantly more work than testing an individual.

Turns out, syphilis satisfies both these criteria. Only a small fraction of people
are infected. And the blood test performed on an individual's sample
can be performed on a cocktail created from a group's blood samples.

Group testing strategies follow a typical pattern. We first divide the
population into several small fixed-size groups. Then we try to (i) test
each of these groups first, hoping that in 1 sweep we can deal with the entire
group; (ii) should a group fail a test, we then do the extra work to
figure out which individual(s) were responsible.

How does this work for syphilis?

1. We first divide the entire population (say those who are about to be drafted)
into small fixed size groups. This is trivial.
2. For each of these groups we obtain a cocktail of the members' blood samples.
3. Should the cocktail pass the syphilis test (i.e. the group doesn't have syphilis),
we can clear the entire group. Given how syphilis manifests itself in a population, this
is pretty likely.
4. Should the cocktail fail the test, we exhaustively test each individual for
syphilis to establish which group member is a victim.

Alright, so the scheme is very simple.

It is clear that in order to cut down extensively on the number of tests
performed, we would like the vast majority of tests performed on the groups
to pass - i.e. if we are able to clear a group, we no longer need to deal
with the individual members.

There are a couple of details we would like to fill in though - how big should these groups
be, and how much of a benefit do we reap with group testing.

Answering these questions requires a tiny bit of algebra. Let us first flesh out some
notation:

* The population is comprised of $ N $ individuals.
* Each group contains $ n $ individuals.
* The fraction of people infected with syphilis is $ p $.

Note that $ n $ is something we need to determine, preferably something optimal
but let us see what develops.

We need to now determine what gains we stand to reap should we adopt
this scheme (as opposed to the naive variant we discussed at the beginning).
One quantity that captures this is the ratio of the _average number of tests_
in the group testing scheme to the naive scheme.

For the naive scheme, we need to perform $ N $ tests (on average if you want).
This is easily observed.

To compute the average number of tests using the group testing scheme,
we add up the possible values weighed by how likely they are (this is called
the expected value).

The various outcomes for a single group are:

1. Nobody in an $ n $-sized group has syphilis and we perform just
1 test.

2. Certain individuals in the group do have syphilis and we're then forced
to perform $ n $ tests on each of the individuals to detect who is infected.

We now need to compute how likely these two outcomes are.

Note that a single individual's likelihood of being infected is $ p $.

The probability that this individual is not infected is given by $ 1 - p $.

The probability that none of the  $ n $ individuals have syphilis is clearly
$ (1 - p)^n $.

Then the probability that at least one individual in the group has syphilis
is $ 1 - (1 - p)^n $. Let us call this $ p^{'} $. This is the probability
that a batch is tainted.

So the likelihood of the first outcome for a group is $ (1 - p)^n $. The likelihood
of the second outcome is $ p^{'} $.

Let us now compute the average number of tests for a population:

There are $ \frac{N}{n} $ groups.

To compute the number of infected groups, we can multiply $ p^{'} $ with $ \frac{N}{n} $.
Thus there are $ p^{'} \cdot \frac{N}{n} $ expected tainted groups.

We are definitely performing 1 test for each group.
This adds to $ \frac{N}{n} $ tests.
For each of the groups that are tainted, we need to perform a test for each
member. So those are $ n $ tests per tainted group.
This value is thus $ n \frac{N}{n} p^{'} $.

Thus, when we leverage group-testing, the expected number of tests you perform are:

$$
N_{group} = \frac{N}{n} + n \frac{N}{n} p^{'}
$$

Recall that the naive scheme requires $ N $ tests.

The ratio of the these two expected number of tests allows us to measure
how many tests can be avoided. This ratio is:

<div>
$$
\begin{align*}
\frac{N_{group}}{N} &= \frac{\frac{N}{n} + n \frac{N}{n} p^{'}}{N} \newline
&= \frac{1}{n} + p^{'} \newline
&= 1 + \frac{1}{n} - 1 + p^{'} \newline
&= \frac{(n+1)}{n} - (1 - p^{'}) \newline
&= \frac{(n+1)}{n} - (1 - p)^n
\end{align*}
$$
</div>

Now that we've got this expression, we can plot the savings for different values of $ n $ and $ p $.

<div class="quote">
     Umuntu ngumuntu ngabantu. <br />
     (A human is a human because of other humans). <br/>
     - A Bantu Declaration
</div>


Obviously, $ p $ is not something we control in this experiment. $ n $ is the
only parameter we can tweak. So, our job is to find a good $ n $ for a given $ p $.

Let us graph this function to see what it looks like. Let us set $ p $ to 0.01

<img src="/img/cost_plot.svg" />

As we can see, there's a nice minimum value (in this case 11) - picking an $ n $ that gets us
this value for a given $ p $ will allow us to minimize the number of blood
tests performed relative to the naive scheme (in this case, we only perform 20% of the tests
we would have in the naive scheme).

I still find it amazing that such a simple scheme cuts down the number
of tests performed by 80 percent (obviously for $ p = 0.01 $).

Syphilis occurred with a $ p $ far less than 0.01. Group testing would end up reaping
far more substantial benefits.

What an asset group-testing turned out to be for the allied forces.

### Tamper Proofing

As we notice, group testing is a really simple idea. Instead of dealing
with individuals, we deal with groups - hoping that population statistics
allow us to get away with not exhaustively dealing with the individuals.

Turns out this strategy is broadly applicable. Let us turn to one of the
oldest applications of computer science - securing information.

Say we have $ N $ items and an adversary is interested in altering them.
This could be a database with $ N $ rows (with something important like
the credit scores).

We obviously would want to detect if a row has been tampered with (the adversary
would presumably modify said row).

We can obviously compute a checksum for each row. For a database with billions
of rows - this is expensive. Checking if the row has been tampered with requires
us to work through billions of rows. We also need to store these checksums
somewhere.

Group testing once again provides a solid approach for dealing with the
problem (assuming only a subset of rows are tampered with).

The scheme for the general problem is a bit involved so let us work with a simpler
version: we have $ N $ items. Just one of the items is potentially tampered with. We would like to detect
just this item.

This problem sounds a bit contrived but this sort of thought experiment allows us to
build intuition and tackle tougher problems.

Let us work through the scheme. First, we have a single checksum for all the rows (row $ i $ is $ d_i $).

<div>
  $$ R_0 = CHECKSUM(d_1, d_2, d_3, ..., d_N) $$
</div>

Once a row is tampered with, $ R_0 $ will reflect that. Recomputing the checksum on the
rows is going to produce a different value.

Of course $ R_0 $ gives us no information about any of the tampered rows.

Turns out we just need an additional $ \ln(N) $ checksums to be able to point to a tampered
item.

Checksum $ i $ which we will call $ R_i $ is computed on all the items $ j = [0, N] $ where the bit $ i $
is 1 in the binary representation of $ j $.

<div>
  $$ R_i = CHECKSUM(d_j \space | \space binary(j)[i] = 1) $$
</div>

And to recover which item is tampered with, start by checking $ R_0 $. If $ R_0 $ has changed,
clearly something's been tampered with.

To retrieve a row (a row index actually) that has been tampered with, start by reconstructing
the binary representation of the index using the checksums. If $ R_i $ isn't consistent, then that particular bit is $ 1 $.
If $ R_i $ is consistent then that bit is $ 0 $. Do this for the $ \ln(n) $ checksums and you have
your row index.

Let us work through an example.

We have 5 items: $ [ d_1, d_2, d_3, d_4, d_5 ] $.

We compute an $ R_0 $ for all the items. This is used to check if any item is tampered with.

Now, we need to compute $ \ln(5) \approx 2 $ checksums. $ R_1 $ is computed over all items
with 1 in position 1 in their binary representation (this is conveniently the set of all odd
numbers from 1 to 5).

So $ R_1 = CHECKSUM(d_1, d_3, d_5) $.

Now, $ R_2 $ is computed over all items with 1 in position 2.

So $ R_2 = CHECKSUM(d_2, d_3) $.

Now say an adversary tampers with $ d_1 $.

Checking $ R_0 $ will inform us that something's been tampered with.

If we check $ R_1 $, we discover it is different from the precomputer version. Thus at position
1 in the index of the tampered item, we include 1.

$ R_2 $ is going to be consistent with what we had before. Thus the tampered item in binary is $ 01 $. Thus
item 1 ( $ d_1 $) has been tampered with. Clearly we have discovered the item that was
tampered with.

So this basic case is easy and already pretty powerful. Say we have a billion items and an adversary
has tampered with a particular value. If we were to compute a checksum for each item and compare to
detect any tampering, it would amount to massive storage costs. In this newer scheme, we only
retain $ ln(1e12) \approx 30 $ checksums. This is a massive reduction in storage and time taken to
detect if something has been tampered with.

Observe how similar this problem is to the approach we used for detecting syphilis. We capped the
number of tampered items at 1 - this is a surrogate for $ p $ in the syphilis case. The binary
representations were used to construct groups ( $ \ln(N) $ of them in this case) and we were
able to test these groups and avoid testing the members exhaustively.

We can extend the scheme above to detect a subset of items with $ O(\ln(N)) $ checksums - provided
we cap the size of the subset at some fixed value. The groups in this case are constructed using a
boolean matrix the rows of which are tested to detect which items have been tampered with. I will
not cover this construction in this post but it is simple to work through.

Group testing actually enables practical implementations of steganography. In a typical scenario,
a spy (or whatever glamorous title you prefer) deals with an object (a document, an image ...). To
protect information in this document, we need to store evidence of genuinity somewhere. Group testing
ideas like the one discussed above allow us to cut down on how much evidence we need to detect
tampering. Cutting down on the evidence we need to provide allows us to build efficient schemes.

Group testing is an amazing testament to modern science. It shows us that good, elegant and beautiful
ideas never languish. Dorfman's approach to detect syphilis in the 40s was his generation's response
to the crisis presented by the war. That very idea is now leveraged to build secure and efficient systems
to protect privacy and share secrets.

### Bibliography

1. Robert Dorfman's paper on group testing [[pdf]](http://projecteuclid.org/euclid.aoms/1177731363) [[mirror]](/docs/dorfman.pdf)
2. Combinatorial Group Testing [[Wikipedia Article]](https://en.wikipedia.org/wiki/Group_testing)