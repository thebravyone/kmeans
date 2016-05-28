/**
* @Author: Guilherme Serradilha
* @Date:   26-May-2016, 23:09:56
* @Last modified by:   Guilherme Serradilha
* @Last modified time: 28-May-2016, 00:26:42
*/


"use strict";
/**
 * [function description]
 * @param  {Array}  data    - Array with shape(n_features, n_samples)
 * @param  {number} n_clusters - number of clusters
 * @return {Self}
 */
var kmeans = function(data, n_clusters) {
    if (typeof data === 'undefined') throw new Error('Sample data is missing.');
    if (typeof n_clusters === 'undefined') n_clusters = 3;

    var n_features = null,
        n_samples  = null;

    var centroids = new Array(),
        labels    = new Array(),
        inertia   = 0;

    // check data
    n_features = data.length;
    n_samples  = data[0].length;
    for (var f = 0; f < n_features; f++) {
        if (n_samples !== data[f].length)
            throw new Error('n_samples are not the same for all features.');
    }

    // get data boundaries
    var boundaries = new Array();
    for (var f = 0; f < n_features; f++) {
        boundaries[f] = { min: Infinity, max: -Infinity };
        for (var s = 0; s < n_samples; s++) {
            if (data[f][s] < boundaries[f].min)
                boundaries[f].min = data[f][s];
            if (data[f][s] > boundaries[f].max)
                boundaries[f].max = data[f][s];
        }
    }

    // start centroids
    for (var c = 0; c < n_clusters; c++) {
        centroids[c] = new Array();
        for (var f = 0; f < n_features; f++) {
            centroids[c][f] = Math.random() * (boundaries[f].max - boundaries[f].min) + boundaries[f].min;
        }
    }

    /**
     * Runs one step of k-means operation
     * @return {Object} - cluster results
     */
    self.step = function() {

        // reset inertia
        inertia = 0;

        // pick closest centroid
        for (var s = 0; s < n_samples; s++) {

            var distance = Infinity,
                label    = 0;

            for (var c = 0; c < n_clusters; c++) {
                var _distance = 0;

                for (var f = 0; f < n_features; f++)
                    _distance += (data[f][s] - centroids[c][f]) * (data[f][s] - centroids[c][f]);
                if (_distance < distance) {
                    distance = _distance;
                    label    = c;
                }
            }

            inertia  += distance;
            labels[s] = label;
        }

        // move centroids torwards center of their own cluster
        for (var c = 0; c < n_clusters; c++) {
            for (var f = 0; f < n_features; f++) {

                var mean_sum   = 0,
                    mean_count = 0;

                for (var s = 0; s < n_samples; s++) {
                    if (labels[s] === c) {
                        mean_sum  += data[f][s];
                        mean_count++;
                    }
                }

                centroids[c][f] = mean_sum / mean_count;
            }
        }

        return {
            centroids: centroids,
            labels: labels,
            inertia: inertia
        }
    }

    /**
     * Predicts centroids and labels for given data
     * @param  {number} max_iterations - maximum iterations [default: 100]
     * @return {Object}                - cluster results
     */
    self.predict = function(max_iterations) {
        if (typeof max_iterations === 'undefined' || !Number.isInteger(max_iterations))  max_iterations = 100;

        var previous_centroids = null;
        for (var i = 0; i < max_iterations; i++) {
            previous_centroids = centroids.toString();
            step();
            if (centroids.toString() === previous_centroids) break;
        }
        return {
            centroids: centroids,
            labels: labels,
            inertia: inertia
        }
    }

    return self;
}

if (typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports)
        exports = module.exports = kmeans;
    exports.kmeans = kmeans;
}
