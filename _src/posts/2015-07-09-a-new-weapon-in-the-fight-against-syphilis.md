    Title: A New Weapon In The Fight Against Syphilis
    Date: 2015-07-17T13:31:26
    Tags: combinatorial-group-testing, group-testing, dorfman, syphilis, groups, testing, mathematics, tamper-proofing

The American war effort in WW2 was characterized by one of the largest compulsory
drafts in history. A staggering 50 million men were registered and nearly 10 million
inducted.

There was just one problem. Circa 1940, we didn't know how to mass-produce penicilin and
contraceptives weren't considered an important public health tool. Syphilis, which was called The Great
Imitator (owing to the wide variety of symptoms that it came with), claimed 6 out of
every 100,000 deaths.  -- some other quote to sound smart here.

These conditions meant that every inductee had to be subjected to a blood test - a
brutal exercise in logistics for a rapidly expanding military.

Robert Dorfman, a Harvard economist, produced an elegant process to cut down
on the number of blood tests needed and in the process produced a seminal paper
in the field of group testing.

In this post, we'll derive the results from that paper - which as you'll observe
boils down to simple algebra.

Then, I'll describe how group-testing is leveraged (quite heavily) in domains like
cryptography. In the problem covered, group testing leads to a very beautiful and
elegant solution.

<!-- http://www.cdc.gov/nchs/data/vsus/vsrates1940_60.pdf -->


<!-- more -->

<div class="img-caption-center">
     <img src="/img/nude_picasso.jpg" /> <br />
     Nude, Green Leaves and Bust - Pablo Picasso
</div>


### Group Testing and Syphilis



<div class="img-caption">
  <img src="/img/dorfman_portrait.jpg" width="50%" style="padding-bottom:10px"/> <br />
  Robert Dorfman - portrait from The Harvard Gazette
</div>

The traditional syphilis test is administered on an individual's blood sample.

In a scheme where we test each individual for an infection, on a population
of size $ N $, we have no choice but to perform $ N $ tests.

In group testing schemes, instead of answering a query about each individual,
we answer a query about a group and in the process, try to avoid doing as
much work as we would in the former scheme.

For a syphilis test, the query is "Does individual x have syphilis?".

The group-testing scheme deals with the query "Do these $ n $ individuals have syphilis?".

The syphilis test can operate on a cocktail of blood samples. So by mixing
the blood samples of $ n $ individuals and running a test on the whole batch
we can indeed answer the group-testing query.

Now say the answer to the query is a _yes_. Then to discover which individual
sample is contaminated, we can test each of the $ n $ samples (we don't have
a choice really).

If the answer is _no_, then we've cleared the entire batch with 1 test.

So it is apparent that for a given group size $ n $ (i.e. the number of people we want
to test in a single batch), and a given prevalence of syphilis in the
population $ p $ (which tells us what fraction of the population is affected).

Some things are obvious from this setting, if $ p $ is close to $ 1.0 $ (i.e. almost
everyone has syphilis), then testing the group is a worthless exercise since
the group is _very_ likely to be contaminated.

If $ p $ is low (this tends to be the norm for diseases), then it is likely
that the group-testing query eliminates the need for testing each individual
in a batch.

Consider the random variable $ X $. $ X $ is the number of tests you need to
conduct.

In addition to these, the entire population is of size $ N $. We consider
the rate of prevalence of syphilis to be $ p $ and the size of each group
we test to be $ n $.

Let us now compute the expected value of $ X $.

Now, were we to test each individual for syphilis, we would perform $ N $ tests.
This is obvious.

In the group-testing setting, we have the following outcomes for a single batch (group):

1. Either nobody in an $ n $-sized group has syphilis and we just perform
1 test on the whole batch.

2. Certain individuals in the group do have syphilis and we're then forced
to perform $ n $ tests on each of the individuals to detect who is infected.

Let us flesh out some quantities:

The probability that none of the  $ n $ individuals have syphilis is clearly
$ (1 - p)^n $.

Then the probability that at least one individual in the group has syphilis
is $ 1 - (1 - p)^n $. Let us call this $ p^{'} $. This is the probability
that a batch is tainted.

There are $ \frac{N}{n} $ groups.

To compute the number of infected groups, we can multiply $ p^{'} $ with $ \frac{N}{n} $.
Thus there are $ p^{'} \cdot \frac{N}{n} $ expected tainted groups.

Now, let us compute the total number of tests. We are definitely performing 1 test
for each group. This contributes $ \frac{N}{n} $ tests towards the final quantity.
For each of the groups that are tainted, we need to perform a test for each group
member. So those are $ n $ tests per tainted group. This value is thus $ n \frac{N}{n} p^{'} $.

Thus, when we leverage group-testing, the expected number of tests you perform are:

$$
N_{group} = \frac{N}{n} + n \frac{N}{n} p^{'}
$$

Recall that the naive scheme requires $ N $ tests.

Do we really reap a benefit by using group testing? We can test this by measuring the
quantity $ N_{group} / N $ - the ratio of the number of tests in the group-testing
scheme vs the number of tests in the naive scheme.

We get:

$$
\frac{N_{group}}{N}\\
= \frac{\frac{N}{n} + n \frac{N}{n} p^{'}}{N}\\
= \frac{1}{n} + p^{'}
$$

We can observe for a broad configuration of $ n $ and $ p^{'} $, this quantity is
less than 1 - implying we do cut down on the number of tests performed. Let us quantify
this a bit further.

$$
\frac{1}{n} + p^{'}\\
= 1 + \frac{1}{n} - 1 + p^{'}\\
= \frac{(n+1)}{n} - (1 - p^{'})\\
= \frac{(n+1)}{n} - (1 - p)^n
$$

Now that we've got this expression, we can plot the savings for different values of $ n $ and $ p $.

Note that $ p $ tells us how prevalent the disease is - a quantity out of our control. We can however
choose an $ n $ that cuts down on the number of tests performed.

Let us now plot this value.

# GENERATE PLOT VALUE AND OTHER SHIT.

Note that this is brilliant - for values of $ p $ that diseases typically exhibit, we indeed have a
solid scheme to perform only a very few tests.

### Tamper Proofing

Now that we have a taste for how to apply group-testing to a problem, we'll build intuition
for a problem we see in computing.

Say you have a database with a billion rows in it. Ideally, we would like to know if
the entries have been tampered with. 
