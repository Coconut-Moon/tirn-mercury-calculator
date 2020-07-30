// Navigate
$(function () {
  $(".navigate-fish-list").click(function () {
    $(".question-one").addClass("display-none")
    $(".question-two").removeClass("display-none")
    $(".results").addClass("display-none")
    window.scrollTo(0, 0);
  });
});

$(function () {
  $("#backToWeight").click(function () {
    $(".question-two").addClass("display-none")
    $(".question-one").removeClass("display-none")
    window.scrollTo(0, 0);
  });
});

$(function () {
    $("#showResults").click(function () {
    $(".question-two").addClass("display-none")
    $(".results").removeClass("display-none")
    window.scrollTo(0, 0);
  });
 });

$(function () {
  $("#backToStart").click(function () {
    $(".results").addClass("display-none")
    $(".question-one").removeClass("display-none")
    window.scrollTo(0, 0);
  });
});



// Store user's weight and units
function storeWeight() {
  var weight = document.getElementById('weight').value;

  //TODO: comment out log troubleshooting
  console.log(weight);

  var weightUnits = document.getElementsByName('weightUnits');

  //TODO: comment out log troubleshooting
  for (var i = 0, length = weightUnits.length; i < length; i++) {
    if (weightUnits[i].checked) {

      console.log(weightUnits[i].value);

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
}

/* Get list of fish from google spreadsheet (owned by TIRN) */


// ID of the Google Spreadsheet
var spreadsheetID = '1Boy1UKFhf_wMjJ6wHHFWAEdRTZ3QxK0f9rntOSkUjmM';

// Json URL
var url =
  'https://spreadsheets.google.com/feeds/list/' +
  spreadsheetID +
  '/1/public/full?alt=json';


// Retrieve fish data
$.getJSON(url, function (data) {

  var googleFishData = []

  var entry = data.feed.entry;

  // Format fish data to something we can read a bit more easily
  $(entry).each(function () {
    googleFishData.push(
      {
        "index": Number(this.gsx$id.$t),
        "name": this.gsx$fish.$t,
        "mercury": Number(this.gsx$mercurylevel.$t),
        "message": this.gsx$message.$t,
        "index": Number(this.gsx$id.$t),
        "bycatch-level": this.gsx$bycatchlevel.$t,
        "bycatch-message": this.gsx$bycatchmessage.$t,
        "microplastics-message": this.gsx$microplasticsmessage.$t
      }
    )
    // Column names are name, age, etc.
    $('.google-json-results').prepend(
      //'<h2>' + this.gsx$fish.$t + '</h2><p>' + this.gsx$mercurylevel.$t + '</p>'
    )
  })
  console.log("New fish data from the GOOOG", googleFishData)

  // Map spreadsheet fish data to a json object
  renderSelectedFishList(googleFishData);

  // Populate the list of fish
  renderFishList(googleFishData);

});

function renderFishList(googleFishData) {
  var template = $("#template").html();
  var html = Mustache.to_html(template, googleFishData);
  $('#fishList').html(html);
}

function renderSelectedFishList(allFishData) {
  allFishData = allFishData || [];

  // Match selected fish to full dataset by INDEX.
  // Build new array of fish results to use to run the calculations
  function returnSelectedFishData(selectedFishIDs) {
    selectedFishIDs = selectedFishIDs || null;
    const selectedFishArray = [];
    // maps through the user's selections
    selectedFishIDs.map(selectedFish => {
      // maps through all of the the data
      allFishData.map(fish => {
        // conditional to compare the fish
        if (fish.index == selectedFish) {
          // add the data to the results array
          selectedFishArray.push(fish)
          console.log("!!!!!! fish mapping results", fish.index)
        }
      })
    })
    return selectedFishArray;
  }

  // Render serving selector for each selected fish when the checkbox status changes
  $(document).on('change', '.fish', function () {

    // This is the array of selected fish you are creating an array with to send to the returnSelectedFish function (logged out below)
    const selectedFishIDs = $("#fishList input:checkbox:checked").map(function () {
      return $(this).data("index");
    }).get();
    console.log("selectedFishIDs", selectedFishIDs)

    selectedFish = returnSelectedFishData(selectedFishIDs);

    // THESE ARE YOUR FISHES!!!!!
    console.log("These are your returned fishes", selectedFish)

    // Send fish data to the template
    function renderSelectedFishTemplate() {
      var template = $("#selectedFishTemplate").html();
      var html = Mustache.to_html(template, returnSelectedFishData(selectedFishIDs));
      $('#selectedFish').html(html);
    }

    // Render the list of selected fish on the page
    renderSelectedFishTemplate();

    // Enable/disable the results button
    if ($(this).is(':checked')) {
      //Enable the submit button.
      $('#showResults').attr("disabled", false);
    } else {
      //If it is not checked, disable the button.
      $('#showResults').attr("disabled", true);
    }

  }); // End document change fish function

  // calculate results when user clicks "Show Results"
  document.getElementById("showResults").addEventListener("click", function (event) {

    // Don't reload the page
    event.preventDefault()

    // Calculate results
    calculateResults(selectedFish)

  });

} // End run fishapp

function calculateResults(selectedFish) {

  console.log("first selectedFish in calculate", selectedFish);

  // An object array for serving sizes and quantities
  var fishAmounts = [];

  // In the selected fish list, pull the serving sizes and quantities into individual fish
  $('#selectedFish li').each(function () {

    // Set selected serving amount
    servingAmountWeekly = $("input[name='serving-amount']", this).map(function () {
      return $(this).val();
    }).get()

    // Set selected measure in ounces
    servingOuncesWeekly = $("select[name='serving-ounces']", this).map(function () {
      return $(this).val();
    }).get()

    // Calculate total ounces
    servingOuncesWeeklyTotal = servingAmountWeekly * servingOuncesWeekly

    // Convert total ounces to grams
    servingTotalGrams = servingOuncesWeeklyTotal * 28.35

    // Calculate daily grams
    servingTotalGramsDaily = servingTotalGrams / 7

    // Add data to each fish
    fishAmounts.push({
      "serving-amount": servingAmountWeekly,
      "serving-ounces": servingOuncesWeekly,
      "serving-grams-weekly": servingTotalGrams,
      "serving-grams-daily": servingTotalGramsDaily
    });
  });
  console.log("Amounts array", fishAmounts);

  // Merge our sizes and quantities with the selected fish
  let fishResults = fishAmounts.map((item, i) => Object.assign({}, item, selectedFish[i]));
  console.log("fish results", fishResults);
  console.log("last selectedFish in calculate", selectedFish);

  // Get user-entered weight
  var weight = document.getElementById("weight").value;

  // Get user-entered weight unit (pounds/kilograms)
  var weightUnits = document.querySelector('.weight-measure:checked').value;

  // Convert pounds to kilograms
  if (weightUnits == "lbs") {
    weightKilos = weight * 0.4535924
  } else {
    weightKilos = weight
  }
  console.log("Weight in kilos", weightKilos);

  // Add daily mercury exposure per fish to object
  fishResults.forEach(function (element) {
    // For each fish, daily mercury exposure = (Mercury content * daily grams) / weight in kilos
    element.mercuryexposuredaily = (Number(element["mercury"]) * Number(element["serving-grams-daily"])) / weightKilos;
  });
  console.log("fishResults, now with more mercury", fishResults);

  //Set EPA recommended total daily mercury exposure (in grams per ounce of fish)
  const EPADailyExposureLimit = 0.1

  // Sum function - Add property values in a given Array
  Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
      total += Number(this[i][prop])
    }
    return total
  }

  // Calculate user's total daily mercury exposure
  const userDailyExposure = fishResults.sum("mercuryexposuredaily");
  console.log("Mercury exposure sum total", userDailyExposure);

  // Add percent of total mercury exposure to each fish in fishlist
  fishResults.forEach(function (element) {
    // For each fish, percent of mercury exposure = element.mercuryexposuredaily /userDailyExposure
    element.mercuryexposurepercent = Math.round((Number(element["mercuryexposuredaily"]) / userDailyExposure) * 100);
  });
  console.log("fishResults, now with exposure percent", fishResults);

  // Calculate total mercury exposure compared to EPA limit
  const userTotalExposurePercent = (userDailyExposure / EPADailyExposureLimit) * 100;
  console.log("Percentage consumed daily", userTotalExposurePercent);

  // Display the "Total exposure" message
  document.getElementById("mercuryExposureMessage").innerHTML = `${Math.round(userTotalExposurePercent)}%`;

  // Display the weight message
  document.getElementById("weightResultsMessage").innerHTML = `Based on a weight of ${weight} ${weightUnits}`;

  // Remove contents of existing chart so we don't duplicate them if we re-calculate
  $("#chart").empty();

  // Le chart
  $(function () {

    var options = {
      series: [{
        data: [Math.round(userTotalExposurePercent)]
      }],
      chart: {
        type: 'bar',
        height: 250,
        width: "100%",
        stackType: "100%"
      },
      annotations: {
        yaxis: [{
          y: 100,
          borderColor: '#FFBABA',
          label: {
            borderColor: '#FFBABA',
            style: {
              color: '#fff',
              background: '#FFBABA',
            },
            text: 'Recommended limit'
          }
        }]
      },
      plotOptions: {
        bar: {
          horizontal: false,
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: ['Mercury level'],
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      yaxis: {
        reversed: false,
        axisTicks: {
          show: true
        }
      }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

  });

  // Now that the data is in place, render the results list
  function renderResults() {
    var template = $("#fishResultsTemplate").html();
    var html = Mustache.render(template, fishResults);
    $('#fishResults').html(html);
  }

  renderResults();

  // Select lists - generic function to change selected value
  function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
  }

  // Set fish results select lists to correct amounts via a data attribute
  $('#fishResults select').each(function () {
    selectElement($(this).attr('id'), $(this).data('servings'))
  });

}; // End calculate results

// Remove fish when x is clicked
function removeFish(item) {
  var fishToRemove = $(item).data('remove')
  console.log("card we wanna remove", fishToRemove)
  $("#fishResult_" + fishToRemove).remove()
  $("#selectedFish_" + fishToRemove).remove()
  $("#fish_" + fishToRemove).prop("checked", false)
  console.log("selectedfish in removefish", selectedFish)

  //renderSelectedFishList(data);
  calculateResults(selectedFish);
};

// TODO: Reset fish results and recalculate everything when we:
// Click "calculate results", remove a fish from results, change the servings, change the units, we want to:
// Recalculate results
// Update fish results
// Update fish selections

// Filter list of fish
function filterFishList() {
  var input, filter, table, tr, label, i, txtValue;
  input = document.getElementById("filterFish");
  filter = input.value.toUpperCase();
  table = document.getElementById("fishList");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    label = tr[i].getElementsByTagName("label")[0];
    if (label) {
      txtValue = label.textContent || label.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Sort list of fish
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("fishList");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/

  // $('#fishList').addClass("loading")
  // $('#fishList td').addClass("display-none")

  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare, one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.querySelector("LABEL").innerHTML.toLowerCase() > y.querySelector("LABEL").innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          $('#fishList th').removeClass("asc dsc")
          $(`#fishList th:nth-child(${n + 1})`).addClass("asc")
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.querySelector("LABEL").innerHTML.toLowerCase() < y.querySelector("LABEL").innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          $('#fishList th').removeClass("asc dsc")
          $(`#fishList th:nth-child(${n + 1})`).addClass("dsc")
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

$(document).ready(function () {
  if ($('#selectedFish').is(':empty')){
    $('#selectedFish').html('foo');
  }

  /* Modal controls */
  // Get the modal
  var modal = document.getElementById("servingModal");
  console.log("get modal", document.getElementById("servingModal"))
  // Get the button that opens the modal
  var btn = document.getElementById("openServingModal");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // Get the <button> element that closes the modal

  btn.onclick = function () {
    event.preventDefault()
    modal.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

});

