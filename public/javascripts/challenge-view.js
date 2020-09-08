function loadData(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "/challenge-view/data", true ); // false for synchronous request
  xmlHttp.send( );
  
  xmlHttp.onreadystatechange = (e) => {
    const response = JSON.parse(xmlHttp.responseText)
    data = []
    var entry;
    for (entry of response["entries"]){
      const datapoint = {x: new Date(entry.x), y: entry["y"]}
      data.push(entry)
    }

    populateChart(data, response["goal"])
  }

}

// DOM Ready =============================================================
$(document).ready(function() {

  const test = document.getElementById("progress-bar").innerHTML
  const number = test.split(" %")[0]
  document.getElementById("progress-bar").setAttribute("aria-valuenow", number)
  $('.progress-bar').css("width", number+"%")


  loadData()
});

// fill and create chart
function populateChart(data, goal) {

    // chart colors
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];

    // create datasets for charts
    const dataset= { datasets: [{
      data: data,
      backgroundColor: 'transparent',
      borderColor: colors[0],
      borderWidth: 4,
      pointBackgroundColor: colors[0],
      label:"Eintrag"
    }]}

    const cumulativeData = []
    for (datapoint of data){
      if(cumulativeData.length>0){
        const cumulativeValue = cumulativeData[cumulativeData.length-1].y + datapoint.y
        newDatapoint = {x: datapoint.x, y:cumulativeValue}
        cumulativeData.push(newDatapoint)
      }
      else{
        cumulativeData.push(datapoint)
      }
    }

    const goalData = []
    for (datapoint of data){
      newDatapoint = {x: datapoint.x, y:goal.value}
      goalData.push(newDatapoint)
    }
    // add final date
    goalData.push({x:goal.endDate, y:goal.value})

    const barChartData= { datasets: [{
        data: cumulativeData,
        backgroundColor: colors[0],
        borderColor: colors[0],
        borderWidth: 4,
        pointBackgroundColor: colors[0],
        label:"Summierter Fortschritt"
      }]}

    const lineChartData =  { datasets: [{
          data: cumulativeData,
          backgroundColor: 'transparent',
          borderColor: colors[0],
          borderWidth: 4,
          pointBackgroundColor: colors[0],
          label:"Summierter Fortschritt"
        }, 
        {
          data: goalData,
          backgroundColor: 'transparent',
          borderColor: colors[1],
          borderWidth: 4,
          pointBackgroundColor: colors[1],
          label:"Ziel"
        },
      ]}
    

    /* large line chart */
    var chLine = document.getElementById("chLine");
    var chLine2 = document.getElementById("chLine2");
    var chBar = document.getElementById("chBar");
   
    // generate charts 
    if (chLine) {
      new Chart(chLine, {
        type: 'line',
        data: dataset,
        options: {
          scales: {
              xAxes: [{
                  type: 'time',
                  time: {
                      unit: 'day'
                  },
                  tooltipFormat: 'MMM DD'
              }],
              yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 10
                }
              }]
          }
      }
    });

    }

    if (chLine2) {
      new Chart(chLine2, {
        type: 'line',
        data: lineChartData,
        options: {
          scales: {
              xAxes: [{
                  type: 'time',
                  time: {
                      unit: 'day'
                  },                  
                  tooltipFormat: 'MMM DD'
              }],
              yAxes: [{
                ticks: {
                    min: 0,
                    suggestedMax: 10
                }
              }]
          }
        }
      });
    }

    if (chBar) {
      new Chart(chBar, {
      type: 'bar',
      data: barChartData,
      options: {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                },
                tooltipFormat: 'MMM DD'
            }],
            yAxes: [{
              ticks: {
                  min: 0,
                  suggestedMax: 10
              }
            }]
        }
    }
      });
    }
};