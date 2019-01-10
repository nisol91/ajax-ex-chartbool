$(document).ready(function() {

  var urlApi = 'http://157.230.17.132:4017/sales';

  function addData () {

      var month_selected = $('.my_select_ii').val();
      var salesman_selected = $('.my_select_i').val();
      var amount_selected = $('.my_input').val();

      //NB il server ti manda indietro sempre una stringa, anche se parsi. Dovrai modificare il valore una volta
      //fatta la chiamata get.


      $.ajax({
        url: urlApi,
        method: 'POST',
        //quando faccio POST, devo sempre mettere dei data da salvare nel server
        data: {
          salesman: salesman_selected,
          amount: amount_selected,
          date: month_selected,
        },
        success: function(data) {

          console.log(amount_selected);
        },
        error: function() {
          alert('errore');
        }
      })
  }

  function cleanData (obj_data) {



    var newObject = {}
    var newObject_2 = {}

    for (var i = 0; i < obj_data.length; i++) {
      // console.log(obj_data[i]['salesman']);
      // console.log(obj_data[i]['amount']);


      //------------------
      //una volta chiamati i dati dal server, verifico che amount sia un numero e non una stringa.
      //se e' una stringa, allora lo parso. non potevo farlo prima perche il server ti manda indietro sempre una stringa,
      //ma non posso modificarlo per ora perche non e' mio il server.(e non sarei nemmeno capace :))
        if (Number.isInteger(obj_data[i].amount) === false) {
          obj_data[i].amount = parseInt(obj_data[i].amount)
        }
      //-------------------------------

      //questa e' la parte importante: creo un oggetto che mi raggruppa i nomi uguali e mi somma i singoli amount di ogni valore
      if (newObject[obj_data[i]['salesman']] == undefined) {
        newObject[obj_data[i]['salesman']] = 0;
      }
      //IMPORTANTISSIMO: in pratica questo if mi dice che: andando a ciclare sui vari oggetti ,
      //se quel salesman (quindi marco, roberto..ecc)non esiste ancora nel nuovo oggetto newObj (==undefined), allora
      //lo vado a posizionare creandolo (cioe ponendo =0) nel nuovo oggetto newObj.

      //poi vado a sommare l amount
      newObject[obj_data[i]['salesman']] += obj_data[i]['amount']
      //nota: questa scrittura significa: le mie proprieta create con l if sopra, sono = a.....
      //ovvero>>>>> proprieta: valore.

      //----parte delle date di vendita---

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


    //con questo for in , inserisco le proprieta e i valori del mio newObject in due array distinti
    var arrLabels = [];
    var arrValues = []
    for (var key in newObject) {
      arrLabels.push(key);
      arrValues.push(newObject[key]);
      //NB obj['key'] e' il nome della proprieta mentre obj[key] senza apici e' una variabile
    }
    // console.log(arrLabels);
    // console.log(arrValues);
    // console.log(newObject);

    //questi due for servono per movificare i valori di data del diagramma a torta,
    //per farli diventare valori relativi al totale.
    var somma = 0;
    for (var i = 0; i < arrValues.length; i++) {
      somma += arrValues[i]
      console.log(arrValues[i]);
    }
    for (var i = 0; i < arrValues.length; i++) {
      arrValues[i] = ((arrValues[i]/somma)*100).toFixed(2);
    }
    console.log(somma);

    //altro for in, come prima, per il fatturato mensile
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

  //da qui in poi le chiamate ajax.
  //***************************//
  //*******CHIAMATE AJAX*******//
  //***************************//



  function getData_1() {
    $.ajax({
      url: urlApi,
      method: 'GET',
      success: function(data) {
        console.log(data);
        console.log(cleanData(data));
        // cleanData(data)
        // cleanData :IMPORTANTE non va assolutamente chiamata! a me basta richiamare i risultati dell oggetto di return, caso per caso.
        // console.log(cleanData(data).labels);
        // console.log(cleanData(data).data);
        // console.log(cleanData(data).dates);


        //****************
        //****GRAFICI*****
        //****************

        //TORTA/DOUGHNUT
        var ctx_pie = $('#myChart_pie');

        var chartPie = new Chart(ctx_pie, {
          // The type of chart we want to create
          type: 'doughnut',

          // The data for our dataset
          data: {
            labels: cleanData(data).labels,
            datasets: [{
              backgroundColor: ['lightblue', 'rgb(38, 109, 111)', 'rgb(93, 115, 164)', 'rgb(136, 154, 185)'],
              borderColor: ['grey', 'grey', 'grey', 'grey'],
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
        console.log(data);
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


  //AGGIUNTA DATI DI VENDITA
  //se clicco add button, allora mi aggiunge i dati di vendita
  //lo metto qui perche prima aggiungo i dati all DB, poi faccio tutta la trafila per renderli leggibili.
  $('.my_button').click(function() {
    addData()
  });





});
