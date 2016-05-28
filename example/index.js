/**
* @Author: Guilherme Serradilha
* @Date:   26-May-2016, 23:10:25
* @Last modified by:   Guilherme Serradilha
* @Last modified time: 27-May-2016, 23:54:58
*/


"use strict";
/**
 * Generates random data using gaussian distribution
 * @return {Object} unlabeled data
 */
var getData = function() {

    // generate focal points
    var min = 5,
        max = 15,
        n_points = 3,
        points   = new Array();

    for (var i = 0; i < n_points; i++) {
        points[i] = new Array();
        points[i][0] = Math.random() * (max - min) + min;
        points[i][1] = Math.random() * (max - min) + min;
    }

    // generate sample data
    var n_samples = 150,
        samples_x = new Array(),
        samples_y = new Array();

    for (var j = 0; j < points.length; j++) {
        for (var i = 0; i < n_samples; i++) {
            samples_x[i + j * n_samples] = gaussian(points[j][0]);
            samples_y[i + j * n_samples] = gaussian(points[j][1]);
            if (isNaN(samples_x[i + j * n_samples]) || isNaN(samples_y[i + j * n_samples])) i--;
        }
    }

    /**
     * Gaussian distribution
     * adapted from: https://github.com/robbrit/randgen
     * @param  {number} mean  - Mean
     * @param  {number} stdev - Standard Deviation
     * @return {number}
     */
    function gaussian(mean, stdev) {
      var u1, u2, v1, v2, s;
      if (mean === undefined) {
        mean = 0.0;
      }
      if (stdev === undefined) {
        stdev = 1.0;
      }
      if (gaussian.v2 === null) {
        do {
          u1 = Math.random();
          u2 = Math.random();

          v1 = 2 * u1 - 1;
          v2 = 2 * u2 - 1;
          s = v1 * v1 + v2 * v2;
        } while (s === 0 || s >= 1);

        gaussian.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s);
        return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean;
      }

      v2 = gaussian.v2;
      gaussian.v2 = null;
      return stdev * v2 + mean;
    }

    return [samples_x, samples_y];
}

/**
 * Draws using Ploty.js
 * @param  {Array} data - array of series to plot
 */
var drawPlot = function(data) {

    var series = new Array();
    for (var i = 0; i < data.length; i++) {
        series[i] = {
            x: data[i][0],
            y: data[i][1],
            mode: 'markers',
            name: 'cluster ' + (i + 1)
        }
    }

    var layout = {
        title:'K-Means Clusters',
        height: 520,
        width: 640
    };

    Plotly.newPlot('myScatterPlot', series, layout, {staticPlot: true});
};

/**
 * Refreshes all data samples
 */
var refresh = function() {
    data    = getData();
    cluster = kmeans(data);
    drawPlot([data]);
};

/**
 * Runs one step of k-means operation
 */
var nextStep = function() {
    var series = new Array(),
        clusterData = cluster.step();

    // create an empty serie for each cluster
    for (var c = 0; c < clusterData.centroids.length; c++) {
        series[c] = [[],[]];
    }

    // populate series
    for (var s = 0; s < clusterData.labels.length; s++) {
        series[clusterData.labels[s]][0].push(data[0][s]);
        series[clusterData.labels[s]][1].push(data[1][s]);
    }

    drawPlot(series);
}

var data,
    cluster;

refresh();
