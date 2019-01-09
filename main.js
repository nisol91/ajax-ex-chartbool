$(document).ready(function() {

  var urlApi = 'http://157.230.17.132:4017/sales';


  function cleanData (obj_data) {
    var newObject = {}
    var newObject_2 = {}

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

      //parte delle date di vendita---
      //prima tramite moment.js ottengo solo il valore del mese e lo sostituisco alla data nell oggetto
      var data_vendita = obj_data[i].date
      // console.log(data_vendita);
      // console.log(moment(data_vendita));
      var mese_vendita = moment(data_vendita, 'DD/MM/YYYY').format('M')
      // console.log(mese_vendita);
      obj_data[i].date = mese_vendita
      // console.log(obj_data[i].date);
      //poi uso lo stesso metodo che avevo utilizzato sopra per i salesman
      if (newObject_2[obj_data[i]['date']] == undefined) {
        newObject_2[obj_data[i]['date']] = 0;
      }

      newObject_2[obj_data[i]['date']] += obj_data[i]['amount']

    }
    console.log(newObject_2);

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
      console.log(arrValues[i]);
    }
    for (var i = 0; i < arrValues.length; i++) {
      arrValues[i] = ((arrValues[i]/somma)*100).toFixed(2);
    }
    console.log(somma);

    //stessa cosa per il fatturato mensile
    var arrMonths = []
    for (var key in newObject_2) {
        arrMonths.push(newObject_2[key]);
    }
    console.log(arrMonths);

    //per far uscire da questa funzione i valori ottenuti devo per forza usare return
    //Questa funzione mi ritorna un oggetto.
    return {
      labels: arrLabels,
      values: arrValues,
      dates: arrMonths,
    }
  }

  function getData_1() {
    $.ajax({
      url: urlApi,
      method: 'GET',
      success: function(data) {
        // console.log(data);
        // cleanData(data)
        // cleanData :IMPORTANTE non va assolutamente chiamata! a me basta richiamare i risultati dell oggetto di return, caso per caso.
        // console.log(cleanData(data).labels);
        // console.log(cleanData(data).data);
        // console.log(cleanData(data).dates);
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
            labels: cleanData(data).labels,
            datasets: [{
              backgroundColor: ['lightblue', 'lightcoral', 'lightyellow', 'lightgreen'],
              data: cleanData(data).values,
            }]
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
        //--------------

      },
      error: function() {
        alert('errore');
      }
    })
  }

  function getData_2() {
    $.ajax({
      url: urlApi,
      method: 'GET',
      success: function(data) {
        // console.log(data);
        // cleanData(data)
        // cleanData :IMPORTANTE non va assolutamente chiamata! a me basta richiamare i risultati dell oggetto di return, caso per caso.
        // console.log(cleanData(data).labels);
        // console.log(cleanData(data).data);
        // console.log(cleanData(data).dates);
        //****************
        //****GRAFICI*****
        //****************


        //GRAFICO A LINEA
          var ctx_2 = $('#lineChart');
          var chart_2 = new Chart(ctx_2, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
              labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              datasets: [{
                label: "Monthly revenue",
                backgroundColor: 'rgba(62, 84, 111, 0.39)',
                borderColor: 'rgba(59, 81, 149, 0.86)',
                data: cleanData(data).dates,
              }]
            },
            // Configuration options go here
            options: {}
          });
          //--------------
      },
      error: function() {
        alert('errore');
      }
    })
  }


//ho dovuto fare due chiamate differenti, una per ogni grafico.
  getData_1()
  getData_2()






});
