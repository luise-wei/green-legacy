// // Userlist data array for filling in info box
// var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  console.log("Hey das Dokument wurde geladen! :) ")
  populateChart();
});

// // Functions =============================================================

// // Fill table with data
// function populateTable() {

//   // Empty content string
//   var tableContent = '';

//   // jQuery AJAX call for JSON
//   $.getJSON( '/users/userlist', function( data ) {

//     // For each item in our JSON, add a table row and cells to the content string
//     $.each(data, function(){
//       tableContent += '<tr>';
//       tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
//       tableContent += '<td>' + this.email + '</td>';
//       tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
//       tableContent += '</tr>';
//     });

//     // Inject the whole content string into our existing HTML table
//     $('#userList table tbody').html(tableContent);
//   });
// };

// fill and create chart
function populateChart() {
    // chart colors
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];

    /* large line chart */
    var chLine = document.getElementById("chLine");
    var chLine2 = document.getElementById("chLine2");
    var chBar = document.getElementById("chBar");
    var chartData = {
      labels: ["S", "M", "T", "W", "T", "F", "S"],
      datasets: [{
        data: [589, 445, 483, 503, 689, 692, 634],
        backgroundColor: 'transparent',
        borderColor: colors[0],
        borderWidth: 4,
        pointBackgroundColor: colors[0]
      },
      {
        data: [639, 465, 493, 478, 589, 632, 674],
        backgroundColor: colors[3],
        borderColor: colors[1],
        borderWidth: 4,
        pointBackgroundColor: colors[1]
      }]
    };

    if (chLine) {
      new Chart(chLine, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        },
        legend: {
          display: false
        }
      }
      });
    }

    if (chLine2) {
      new Chart(chLine2, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        },
        legend: {
          display: false
        }
      }
      });
    }

    if (chBar) {
      new Chart(chBar, {
      type: 'bar',
      data: chartData,
      options: {
        label: "This is a barchart",
        legend: {
          display: true
        }
      }
      });
    }
};