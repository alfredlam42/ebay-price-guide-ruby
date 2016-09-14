// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require handlebars.runtime
//= require handlebars
//= require_tree ./templates
//= require_tree .

$(document).ready(function(){
  $('form').on('submit', function(event){
    event.preventDefault();

    var searchResult = {};
    var data = $(this).serialize()
    var searchParam = $('#item').val();
    var retailPrice = $('#retailPrice').val();
    var status;

    if ($('#completed')[0].checked){
      status = 'Sold';
    } else {
      status = 'On Sale';
    };

    console.log('before ajax');

    $.ajax({
      method: 'POST',
      data: data,
      url: '/search',
      dataType: 'JSON'
    })

    .done(function(response){
      console.log('ajax call sucessful');
      console.log('waiting for prepend results');
      console.log('response:');
      console.log(response);
      //the property of the first object is different depending in the completed box is checked
      var items = response[Object.keys(response)[0]].searchResult.item;
      var imageURL = items[0].galleryURL;
      var calculations = getCalculations(items);
      var dataPoints = [calculations.lowest, calculations.lowerQuartile, calculations.median, calculations.upperQuartile, calculations.highest];

      var profits = calculateProfits(calculations, retailPrice)

      var templateData = {
        name: searchParam,
        status: status,
        image: imageURL,
        low: calculations.lowest.toFixed(2),
        lowProfit: profits.lowest.toFixed(2),
        lowProfitPercent: profits.lowestPercent,
        average: calculations.average.toFixed(2),
        averageProfit: profits.average.toFixed(2),
        averageProfitPercent: profits.averagePercent,
        median: calculations.median.toFixed(2),
        medianProfit: profits.median.toFixed(2),
        medianProfitPercent: profits.medianPercent,
        high: calculations.highest.toFixed(2),
        highProfit: profits.highest.toFixed(2),
        highProfitPercent: profits.highestPercent,
        lowerQuartile: calculations.lowerQuartile.toFixed(2),
        lowerQuartileProfit: profits.lowerQuartile.toFixed(2),
        lowerQuartileProfitPercent: profits.lowerQuartilePercent,
        upperQuartile: calculations.upperQuartile.toFixed(2),
        upperQuartileProfit: profits.upperQuartile.toFixed(2),
        upperQuartileProfitPercent: profits.upperQuartilePercent,
      }
      var resultsTemplate = HandlebarsTemplates['search/create'](templateData);

      $('#results').prepend(resultsTemplate);
      addChart(dataPoints, calculations.prices.length);
    })

  // var exampleOneData = {name: 'SDCC Hasbro Maximus', status: 'Sold', image: 'http://thumbs.ebaystatic.com/images/g/M9QAAOSwENxXmmqL/s-l225.jpg', low: 200.00, average: 279.00, high: 300};
  // var exampleOneTemplateData = Handlebars.templates.results(exampleOneData);

  // $('#results').prepend(exampleOneTemplateData);
  // $('#chart')

  })
})

function getCalculations(items){
  var calculations = {
    lowest: 0,
    highest: 0,
    average: 0,
    median: 0,
    lowerQuartile: 0,
    upperQuartile: 0,
    prices: []
  };

  calculations.prices = getPrices(items);
  calculations.lowest = calculations.prices[0];
  calculations.highest = calculations.prices[calculations.prices.length - 1];
  calculations.average = calculateAverage(calculations.prices);
  calculations.median = calculateMedian(calculations.prices);

  if (calculations.prices.length % 2 === 0){
    calculations.lowerQuartile = calculateMedian(calculations.prices.slice(0, calculations.prices.length / 2));
    calculations.upperQuartile = calculateMedian(calculations.prices.slice(calculations.prices.length / 2, calculations.prices.length));
  } else{
    calculations.lowerQuartile = calculateMedian(calculations.prices.slice(0, Math.floor(calculations.prices.length / 2)));
    calculations.upperQuartile = calculateMedian(calculations.prices.slice(Math.floor(calculations.prices.length / 2) + 1, calculations.prices.length));
  }

  return calculations;
}

function getPrices(items){
  var prices = [];

  items.map(function(item){
    var price = parseInt(item.sellingStatus.currentPrice.__content__);
    prices.push(price);
  });

  prices = prices.sort(function(a,b){return a - b});

  return prices;
}

function calculateAverage(prices){
  var sum = prices.reduce(add, 0);
  return sum / prices.length
}

function add(a, b){
  return a + b;
}

function calculateMedian(prices){
  if (prices.length % 2 === 0){
    return (prices[prices.length / 2] + prices[(prices.length / 2) - 1]) / 2;
  } else {
    return prices[Math.floor(prices.length / 2)];
  }
}

function calculateProfits(calculations, retailPrice){
  var profits = {
    lowest: 0,
    lowestPercent: 0,
    highest: 0,
    highestPercent: 0,
    average: 0,
    averagePercent: 0,
    median: 0,
    medianPercent: 0,
    lowerQuartile: 0,
    lowerQuartilePercent: 0,
    upperQuartile: 0,
    upperQuartilePercent: 0
  }

  profits.lowest = (calculations.lowest * 0.871) - retailPrice;
  profits.lowestPercent = ((profits.lowest / retailPrice) * 100).toFixed(2);
  profits.highest = (calculations.highest * 0.871) - retailPrice;
  profits.highestPercent = ((profits.highest / retailPrice) * 100).toFixed(2);
  profits.average = (calculations.average * 0.871) - retailPrice;
  profits.averagePercent = ((profits.average / retailPrice) * 100).toFixed(2);
  profits.median = (calculations.median * 0.871) - retailPrice;
  profits.medianPercent = ((profits.median / retailPrice) * 100).toFixed(2);
  profits.lowerQuartile = (calculations.lowerQuartile * 0.871) - retailPrice;
  profits.lowerQuartilePercent = ((profits.lowerQuartile / retailPrice) * 100).toFixed(2);
  profits.upperQuartile = (calculations.upperQuartile * 0.871) - retailPrice;
  profits.upperQuartilePercent = ((profits.upperQuartile / retailPrice) * 100).toFixed(2);

  return profits;
}

function addChart(dataPoints, dataLength){
  $('#chart').highcharts({
    chart: {
        type: 'boxplot'
    },

    title: {
        text: String(dataLength) + ' Items Calculated'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        categories: ['1'],
        title: {
            text: 'Item'
        }
    },

    yAxis: {
        title: {
            text: 'Price Range'
        }
    },

    plotOptions: {
        boxplot: {
            fillColor: '#F0F0E0',
            lineWidth: 2,
            medianColor: '#0C5DA5',
            medianWidth: 3,
            stemColor: '#A63400',
            stemDashStyle: 'dot',
            stemWidth: 1,
            whiskerColor: '#3D9200',
            whiskerLength: '20%',
            whiskerWidth: 3
        }
    },

    series: [{
        name: 'Prices',
        data: [dataPoints]
    }]
  })
}