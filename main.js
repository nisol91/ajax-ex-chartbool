$(document).ready(function() {

  var urlApi = 'http://157.230.17.132:4017/sales';


  function cleanData (obj_data) {

    var newObject = {}
    for (var i = 0; i < obj_data.length; i++) {
      // console.log(obj_data[i]['salesman']);
      // console.log(obj_data[i]['amount']);


      //questa e' la parte importante: creo un oggetto che mi raggruppa i nomi uguali e mi somma i singoli amount di ogni valore
      if (newObject[obj_data[i]['salesman']] == undefined) {
        newObject[obj_data[i]['salesman']] = 0;
      }
      //IMPORTANTISSIMO: in pratica questo if mi dice che: andando a ciclare sui vari oggetti , se salesman non esiste(==undefined), allora
      //lo vado a posizionare creandolo (cioe ponendo =0) nel nuovo oggetto newObj.

      //poi vado a sommare l amount
      newObject[obj_data[i]['salesman']] += obj_data[i]['amount']

    }


    var arrLabels = [];
    var arrValues = []
    for (var key in newObject) {
        arrLabels.push(key);
        arrValues.push(newObject[key]);
    }
    // console.log(arrLabels);
    // console.log(arrValues);
    // console.log(newObject);
    var somma = 0;
    for (var i = 0; i < arrValues.length; i++) {
      somma += arrValues[i]
      // console.log(arrValues[i]);
    }
    for (var i = 0; i < arrValues.length; i++) {
      arrValues[i] = ((arrValues[i]/somma)*100).toFixed(2);
    }
    // console.log(somma);


    //per far uscire da questa funzione i valori ottenuti devo per forza usare return
    //Questa funzione mi ritorna un oggetto.
    return {
      labels: arrLabels,
      values: arrValues,
    }
  }

  function getData() {
    $.ajax({
      url: urlApi,
      method: 'GET',
      success: function(data) {
        // console.log(data);
        cleanData(data)
        // console.log(cleanData(data).labels);
        // console.log(cleanData(data).data);
        // console.log(cleanData(data).tot_revenue);
        //****************
        //****GRAFICI*****
        //****************

        //TORTA
        var ctx_pie = $('#myChart_pie');

        var chartPie = new Chart(ctx_pie, {
          // The type of chart we want to create
          type: 'pie',

          // The data for our dataset
          data: {
            // labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto"],
            labels: cleanData(data).labels,
            datasets: [{
              // label: ,
              backgroundColor: ['lightblue', 'lightcoral', 'lightyellow', 'lightgreen'],
              data: cleanData(data).values,
            }]
            //--------------
          },
          // Configuration options go here
          options: {
            //per aggiungere il segno di percentuale con una funzione callback
            tooltips: {
              mode: 'label',
              callbacks: {
                  label: function(tooltipItem, data) {
                    return data['datasets'][0]['data'][tooltipItem['index']] + '%';
                  }
                }
            },
          }
        });
      },
      error: function() {
        alert('errore');
      }
    })
  }

  getData()










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
