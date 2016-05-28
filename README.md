<!--
@Author: Guilherme Serradilha
@Date:   26-May-2016, 23:05:37
@Last modified by:   Guilherme Serradilha
@Last modified time: 28-May-2016, 00:26:39
-->


# K-means Clustering
Node implementation of unsupervised learning using k-means algorithm

## What does k-means stand for?
It's all about [machine learning unsupervised](https://en.wikipedia.org/wiki/Unsupervised_learning) (i.e. unlabeled) data.

Usually, when learning from data, you'll rely on a set of labels *teaching* your algorithm what the correct answers look like. In other hand, clustering methods are useful in those cases which there are no labels available at all.

![K-means Clusters Example](/example/example.jpg)

[K-means](https://en.wikipedia.org/wiki/K-means_clustering) clustering is a method of vector quantization that is popular for cluster analysis in data mining. K-means clustering aims to partition `n` observations into `k` clusters in which each observation belongs to the cluster with the nearest mean, serving as a prototype of the cluster. This results in a partitioning of the data space into [Voronoi cells](https://en.wikipedia.org/wiki/Voronoi_diagram).

In other words, it will form groups of similar data and label them for you.

## Getting ready
First of all you will need an array of data shaped like [n_features, n_samples].

```javascript
var speed = [10, 12, 15, 08, 11];
var mass  = [72, 71, 65, 83, 70];

// this data is ready for our algorithm!
var data = [speed, mass];
```

In our example above, we have two features: *speed* and *mass*. Let's consider our samples as data collected from five different *athletes*.

When drawing it to a scatter plot each `feature` would be an axis and each `sample` a dot.

## How does it work?
K-means is often referred to as [Lloyd’s algorithm](https://en.wikipedia.org/wiki/Lloyd%27s_algorithm). In basic terms, the algorithm has four steps:

1. Choose initial centroids
2. Assign each sample to its nearest centroid
3. Move centroids to the mean value of all samples assigned to it
4. Loop steps 2 and 3 until centroids stop moving significantly

### kmeans(data[, n_clusters])
This function works like a constructor, initializing centroids and returning a *cluster object* for iteration.

`data {array}` Sample data with shape [n_features, n_samples]

`n_clusters {integer}` *(default = 3)* Number of clusters

```javascript
const kmeans = require('kmeans');
var cluster = kmeans(data, 2);
```

### predict([max_iterations])
Predicts centroids and labels for its *cluster object*.

`max_iterations {integer}` *(default = 100)* maximum number of steps (iterations)

Even though you can set a maximum number of iterations, usually the process will end before reaching it.

This functions returns an object containing centroids, labels and inertia.

```javascript
cluster.predict();
-----
{
    centroids: [
        [10, 74],
        [15, 65]
    ],
    labels: [0, 0, 1, 0, 0],
    inertia: 118.75
}
```

### step()
Runs a single step of k-means loop and returns an object containing centroids, labels and inertia.

## Glossary

#### centroids
Coordinates of cluster centers.

#### labels
Labels of each sample as index of its related cluster.

Back to our scatter plot example, `labels` can act like series of data.

#### inertia
Sum of distances of samples to their closest cluster center. Inertia is not a normalized metric, we basically assume that lower values are better and zero is optimal.

## Troubleshooting

### Dealing with outliers
Most of the time all we need is to fit the central training data, ignoring deviant observations like outliers. K-means works by calculating mean values, therefore outliers have huge impact as they can pull centroids towards them.

In order to mitigate this you might find a good idea to [truncate](https://goo.gl/rR01XA) your samples, thus omitting values that are too big or too small if compared to the rest of data.

### Avoiding local optimum
Sometimes you will end up with clusters being formed in odd positions like in the image bellow.

![K-means Clusters - Local Optimum](/example/local-optimum.jpg)

It happens because k-means algorithm aims for [local optimum](https://en.wikipedia.org/wiki/Local_optimum) instead of global optmium. In other words, It just doesn't look at the big picture, solving labels locally through the perspective of its own centroids starting positions.

We initialize our centroids by picking random values inside the range (min and max) of each feature, therefore its hard to predict if any local optimum will occur.

This is when `inertia` comes in handy.

Several different cluster layouts may be generated for a same given data-set, however the one with lowest `inertia` tends to be a better global optimum. So a common workaround to avoid local optimum is to run k-means a couple of times - with different initializations of the centroids - and compare their `inertia` values later on.

## Dependencies
This library has no dependencies and can run on either browsers or node.js environment.

All scatter plots inside example files are drawn using [plotly.js](https://github.com/plotly/plotly.js).
