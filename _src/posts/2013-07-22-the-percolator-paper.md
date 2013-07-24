    Title: The Percolator Paper
    Date: 2013-07-24T18:54:28
    Tags: reading, paper, percolator, google-research, map-reduce

In the IR reading group this week I decided to read the Percolator paper from Google[1]. It caused quite a stir on several news-reading sites after a Google Research blog-post on the topic. Since I've never had the chance to read it, this is as good a time as any. <strong>This is not a comprehensive summary at all and lots of results here are hand-wavy. If you want to instruct yourself, please read the paper.</strong>

<!-- more -->

## Setting

Index updates involve making several small updates to a large data store. Map-Reduce and batch-processing systems aim for ammortized efficiency and index updates do not lend themselves well to this category.

### Index Construction:

Index construction can be summarized as accessing every page on the web and processing these pages while keeping track of invariants.

If we were to structure this as a collection of MapReduce tasks, in a sequence of jobs, we identify duplicates, invert links and finally come to the task of building the index itself (this is the task of index construction - I will not deal with it here).

If we would like to process a small batch of documents and then update our index, we can see that the task of link-inversion would require a batch job over the entire newer repository. As such this system doesn't lend itself to processing jobs in small batches. Percolator exists to solve this problem.

## Percolator

Percolator provides us:

* random access to the data repository
* strong consistency guarantees

Its components are:

### BigTable:

This is used to store structured data designed to scale. It is not a fully relational database but allows control over the underlying data model.

The data is indexed using row and column names (this is up to the application). The cells store strings (these are not interpreted so you can marshall objects here).

An example of an object in BigTable is:

<pre>
(com.cnn.www, contents, t1 - <CNN Homepage Content>)
(com.cnn.www, anchor:src-page1, t1 - target_page_link)
.
.
.
</pre>

So, the row-key there was the domain (written out in the inverse format the RFC allows). The column-keys shown are the contents and an anchor (the keys are arbitrary and up to us).

<strong>Rows:</strong> Data is stored in sorted order (lexicographic) of <strong>row-keys</strong>. Tablets are row-ranges and these are distributed across machines. Locality is to be achieved by keeping closely associated items within a tablet.

<strong>Columns:</strong> Column keys are grouped into column families. The same type of data is stored in a family. Access control happens here. 

This also allows applications of various kinds (read-intensive v. write-intensive or privacy-preserving).

<strong>Timestamps:</strong> Versioning of data is achieved using timestamps. For example, we store the CNN homepage at different timestamps.

<strong>Transactions:</strong> ACID guarantees are provided. <code>commit()</code> and <code>get()</code> are blocking. Thread pools are used for parallel access. Reads don't require locking. 

Locking is implemented in Percolator itself as opposed to BigTable. This locking mechanism is stored in BigTable as well (particularly in in-memory columns).

The timestamp oracle (my guess is that this is like zookeeper) determines the start time of a transaction and thus determines what snapshot a <code>get()</code> request sees. <code>set()</code> requests are buffered until a commit.

The <code>commit()</code> procedure is:

* Lock all the cells being written.
* <code>write-write</code> locks occur when a new write lock is obtained after the current write transaction has started (and is ongoing). The snapshot isolation prevents this.
* Any other lock seen results in an abort of the <code>commit</code>.
* If there is no conflict, write the lock and the data to the corresponding cell.
* Then obtain a commit timestamp and make the write visible to readers by replacing the lock with a write record.

In the event of client failure, locks are left behind and need to be cleaned up. A primary lock is used and if a crash has occurred the primary lock can be used to determine a crash of a previous transaction and thus the locks can be discarded.

<strong>Timestamp Oracle:</strong> This is a server that hands out timestamps (so zookeeper? or whatever Google uses - It's called Chubby I think).

### Triggers

Percolator has a mechanism for triggering and running transactions. A set of observer binaries register a thunk with columns that get called upon an update. Percolator applications are structured like these.

## Performance

MapReduce involves one bulk read from the GFS which Percolator performs 50 operations per document resulting in a lot of RPCs.

Commits also require RPCs and to reduce this count transactions involving one column are batched together and performed in 1 RPC.

The same batching is used to serve <code>read()</code> requests as well. Pre-fetching is another optimization that is aimed at making use of locality (in terms of the columns involved) in requests.

A newly crawled document enters the searchable index faster using Percolator than when using MapReduce.

Since the document enters the index quicker:

* The index can grow larger (no need to process the index as-is every single time).
* The corpus is fresher (documents don't spend days in the sequence of MapReduce jobs).
* There is an increase in resources used but the gains are greater than they would have been using MapReduce.

At extremely high crawl rates, it is more efficient to use MapReduce but real systems exhibit crawl rates that make Percolator a better choice than MapReduce.

Percolator is an implementation on top of BigTable so it is marginally slower than BigTable operations.

The paper also provided results using the TPC-E benchmark [2] - Percolator is <strong>3x</strong> better than the leader of the TPC-E board (although I am not sure if these numbers mean anything). This comes at the cost of a 30-fold overhead and this is a (potential) area of improvement.

[1] <a href="http://research.google.com/pubs/pub36726.html">http://research.google.com/pubs/pub36726.html</a>
[2] <a href="http://www.tpc.org/default.asp">http://www.tpc.org/default.asp</a>