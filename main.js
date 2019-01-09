$(document).ready(function() {



//TORTA
  var ctx_pie = $('#myChart_pie');

  var chartPie = new Chart(ctx_pie, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
      // labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto"],
      labels: [
        'lightblue',
        'lightcoral',
        'yellow'
      ],
      datasets: [{
        label: ['green'],
        backgroundColor: ['lightblue', 'lightcoral', 'yellow'],
        // backgroundColor: 'rgb(255, 99, 132, .5)',
        // borderColor: 'rgb(255, 99, 132)',
        data:[10],
      }]
    },
    // Configuration options go here
    options: {}
  });
//--------------
//GRAFICO A LINEA
  var ctx_2 = $('#lineChart');
  var chart_2 = new Chart(ctx_2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [{
        label: "My First dataset",
        backgroundColor: 'rgb(255, 99, 132, .5)',
        borderColor: 'rgb(255, 99, 132, .8)',
        data: [0, 10, 5, 2, 20, 30, 45],
      },
      {
        label: "My Second dataset",
        backgroundColor: 'rgba(62, 84, 111, 0.39)',
        borderColor: 'rgba(59, 81, 149, 0.86)',
        data: [0, 20, 15, 0, 20, 30, 85],
      }]
    },

    // Configuration options go here
    options: {}
  });
  //--------------







});
