jQuery(document).ready(function ($) {

  // ID of the Google Spreadsheet
  var spreadsheetID = '1Boy1UKFhf_wMjJ6wHHFWAEdRTZ3QxK0f9rntOSkUjmM';

  // Json URL
  var url =
    'https://spreadsheets.google.com/feeds/list/' +
    spreadsheetID +
    '/1/public/full?alt=json';

  var googleFishData = []

  var selectedFish = []

  var fishResultsArray = []

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
    $("#backToStart").click(function () {
      $(".results").addClass("display-none")
      $(".question-one").removeClass("display-none")
      $("#fishList .fish").prop("checked", false)
      window.scrollTo(0, 0);

      // Remove all the fish
      for (var i = 0; i < googleFishData.length; i++) {
        removeFish(i)
      }

    });
  });

  // Display the list of fish on the page

  function renderFishList(googleFishData) {
    var template = $("#fishListTemplate").html();
    var html = Mustache.to_html(template, googleFishData);
    $('#fishListTable').html(html);
  }

  // Create the array of selected fish
  function createSelectedFishArray(googleFishData) {

    // Check the fish data
    googleFishData = googleFishData || [];


    // Get Selected fish IDs
    const selectedFishIDs = $("#fishList input:checkbox:checked").map(function () {
      return $(this).data("id");
    }).get();


    // Match selected fish to full dataset by id.
    // Build new array of fish results to use to run the calculations
    function returnSelectedFishData(selectedFishIDs) {

      selectedFishIDs = selectedFishIDs || null;

      const selectedFishArray = [];
      // maps through the user's selections
      selectedFishIDs.map(selectedFish => {
        // maps through all of the the data
        googleFishData.map(fish => {
          // conditional to compare the fish
          if (fish.id == selectedFish) {
            // add the data to the results array
            selectedFishArray.push(fish)

          }
        })
      })
      return selectedFishArray;
    }

    selectedFish = returnSelectedFishData(selectedFishIDs);

  }

  /* Create list of fish from google spreadsheet (owned by TIRN) */

  // Retrieve fish data
  $.getJSON(url, function (data) {

    var entry = data.feed.entry;

    // Format fish data to something we can read a bit more easily
    $(entry).each(function () {
      googleFishData.push(
        {
          "id": Number(this.gsx$id.$t),
          "name": this.gsx$fish.$t,
          "mercury": Number(this.gsx$mercurylevel.$t),
          "mercury-rating": this.gsx$mercuryrating.$t,
          "message": this.gsx$message.$t,
          "general-alert": this.gsx$generalalert.$t,
          "general-alert-message": this.gsx$generalalertmessage.$t,
          "bycatch-level": this.gsx$bycatchlevel.$t,
          "bycatch-message": this.gsx$bycatchmessage.$t,
          "microplastics-message": this.gsx$microplasticsmessage.$t
        }
      )
    })

    // Map spreadsheet fish data to a json object
    createSelectedFishArray(googleFishData);

    // Populate the list of fish
    renderFishList(googleFishData);

  })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);

      $(".fishlist-wrapper")
        .html("<p>Something went wrong and we can't load the list of fish. Try refreshing the page, or let us know if the problem persists.<p>")
        .addClass("error");

      $("#fishList").addClass("display-none");




    });

  // Render serving selector for each selected fish when the checkbox status changes
  $(document).on('change', '.fish', function () {

    //Update selected Fish Array
    createSelectedFishArray(googleFishData)

    // Send fish data to the template
    function renderSelectedFishTemplate() {
      var template = $("#selectedFishTemplate").html();
      var html = Mustache.to_html(template, selectedFish);
      $('#selectedFish').html(html);
    }

    // Render the list of selected fish on the page
    renderSelectedFishTemplate();

    // Enable/disable the results button
    if ($("#fishList input[type='checkbox']:checked").length > 0) {
      //Enable the submit button.
      $('#showResults').attr("disabled", false);
    } else {
      //If it is not checked, disable the button.
      $('#showResults').attr("disabled", true);
    }

  }) // End document change fish function

  /* Calculate Results of fish selection */

  // This should run when a user
  // * Selects a new fish
  // * Changes a fish input (serving, weight)
  // * Removes a fish

  function calculateResults(selectedFish) {

    // ----- Update list of selected fish with user selected values

    // Container for serving sizes and quantities
    var fishAmounts = [];

    // In the selected fish list, pull the serving sizes and quantities into individual fish
    $('#selectedFish li').each(function () {

      // Set selected serving amount
      const servingAmountWeekly = $("input[name='serving-amount']", this).map(function () {
        return $(this).val();
      }).get()

      // Set selected measure in ounces
      const servingOuncesWeekly = $("select[name='serving-ounces']", this).map(function () {
        return $(this).val();
      }).get()

      // Calculate total ounces eaten
      const servingOuncesWeeklyTotal = servingAmountWeekly * servingOuncesWeekly

      // Convert total ounces to grams
      const servingTotalGrams = servingOuncesWeeklyTotal * 28.35

      // Calculate daily grams eaten
      const servingTotalGramsDaily = servingTotalGrams / 7

      // Add data to each fish
      fishAmounts.push({
        "serving-amount": servingAmountWeekly,
        "serving-ounces": servingOuncesWeekly,
        "serving-grams-weekly": servingTotalGrams,
        "serving-grams-daily": servingTotalGramsDaily
      });
    });

    // Merge our sizes and quantities with the selected fish
    fishResultsArray = fishAmounts.map((item, i) => Object.assign({}, item, selectedFish[i]));
    console.log("initial fishResultsArray", fishResultsArray);

    // ----- Calculate mercury exposure

    // Get user-entered weight
    const weight = document.getElementById("weight").value;

    // Get user-entered weight unit (pounds/kilograms)
    const weightUnits = document.querySelector('.weight-measure:checked').value;

    // Convert pounds to kilograms
    let weightKilos = weight;
    if (weightUnits === "lbs") {
      weightKilos = weight * 0.4535924;
    }

    // Add daily mercury exposure per fish to Fish Results
    fishResultsArray.forEach(function (element) {
      // For each fish, daily mercury exposure = (Mercury content * daily grams) / weight in kilos
      element.mercuryexposuredaily = (Number(element["mercury"]) * Number(element["serving-grams-daily"])) / weightKilos;
    });

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
    const userDailyExposure = fishResultsArray.sum("mercuryexposuredaily");

    // Add total mercury exposure to each fish in fishlist
    fishResultsArray.forEach(function (element) {
      // For each fish, percent of mercury exposure = element.mercuryexposuredaily /userDailyExposure
      element.mercuryexposurepercent = Math.round((Number(element["mercuryexposuredaily"]) / userDailyExposure) * 100);
      element.mercuryexposureepa = Math.round((Number(element["mercuryexposuredaily"]) / EPADailyExposureLimit) * 100);
      //element.mercuryexposureweeklytotal = (Number(element["mercuryexposuredaily"]) * 7).toFixed(3);
    });

    // Calculate total mercury exposure compared to EPA limit
    const userTotalExposurePercent = (userDailyExposure / EPADailyExposureLimit) * 100;

    // ----- Render some values on the  results page and footer

    // Display the weight message
    document.getElementById("weightResultsMessage").innerHTML = `Based on a weight of ${weight} ${weightUnits}`;

    // ----- Render the chart

    // Calculate the amount of mercury over the recommended limit
    var totalMercuryOverage = userDailyExposure - EPADailyExposureLimit;

    // Calculate height of the overage bar
    var chartExposureOverageBar = Math.max(0, Math.floor(((userDailyExposure - EPADailyExposureLimit) / userDailyExposure) * 100));

    // Calculate height of the recommended bar bar
    var chartExposureRecBar = Math.max(0, Math.floor((userDailyExposure / EPADailyExposureLimit) * 100));

    // Use jquery to set the values appropriately
    var chartOverage = $('#mercuryExposureOverageBar');
    var chartRec = $('#mercuryExposureRecBar');

    if (userDailyExposure > EPADailyExposureLimit) {

      // Display the "Total exposure" message
      document.getElementById("mercuryExposureMessage").innerHTML = `${Math.round(totalMercuryOverage * 1000)}% over`;

      $(chartOverage)
        .attr('height', chartExposureOverageBar + '%')
        .attr('y', 0);
      $(chartRec)
        .attr('height', chartExposureRecBar + '%')
        .attr('y', chartExposureOverageBar + '%');

      // Change the first text element
      $('#chartPercentage100').text(Math.floor(userTotalExposurePercent) + '%');
      $('#chartPercentage80').text(Math.floor(userTotalExposurePercent * .8) + '%');
      $('#chartPercentage60').text(Math.floor(userTotalExposurePercent * .6) + '%');
      $('#chartPercentage40').text(Math.floor(userTotalExposurePercent * .4) + '%');
      $('#chartPercentage20').text(Math.floor(userTotalExposurePercent * .2) + '%');

    } else {

      // Display the "Total exposure" message
      document.getElementById("mercuryExposureMessage").innerHTML = `${Math.round(userTotalExposurePercent)}% of`;

      $(chartOverage)
        .attr('height', 0)
        .attr('y', 0);
      $(chartRec)
        .attr('height', chartExposureRecBar + '%')
        .attr('y', Math.max(0, (100 - chartExposureRecBar)) + '%');
    }

    // --- render the results cards - separate function?

    console.log("fishResultsArray, as rendered", fishResultsArray);
    // Now that the data is in place, render the results list
    function renderResults() {
      var template = $("#fishResultsTemplate").html();
      var html = Mustache.render(template, fishResultsArray);
      $('#fishResults').html(html);
    }
    renderResults();

    // Render data in the footer
    function renderRawData() {
      var template = $("#fishResultsRawDataTemplate").html();
      var html = Mustache.render(template, fishResultsArray);
      $('#fishResultsRawData').html(html);
    }
    renderRawData();

  } // End calculate results

  // Remove fish from everywhere
  function removeFish(fishToRemove) {

    $("#selectedFish_" + fishToRemove).remove()
    $("#fish_" + fishToRemove).prop("checked", false)
    $("#fishResult_" + fishToRemove).remove()

    selectedFish.map((thisFish, i) => {
      if (thisFish.id === fishToRemove) {
        selectedFish.splice(i, 1)
      }

    })
    calculateResults(selectedFish);

    updateResultsInputs()

  };

  // Remove fish when x is clicked
  $(document).ready().on('click', '.remove-fish', function () {
    removeFish($(this).data('id'))
    console.log(this)
  });

  // Recalculate results when serving quantity number changes
  $(document).ready().on('change', '#fishResults input[type="number"]', function () {

    // Update the user inputs on the results page to match those on the selection page
    let currentInput = parseInt($(this).attr("data-id"));

    let currentValue = $(this).val();

    // Set fish results select lists to correct amounts via a data attribute
    $('#selectedFish input[type="number"]').each(function () {
      thisFish = parseInt($(this).attr("data-id"))
      console.log("This Fish", thisFish)

      if (thisFish === currentInput) {
        $(this).val(currentValue)
      }

      selectedFish.map((currentInput, i) => {
        if (currentInput === thisFish) {
          selectedFish[i]["serving-amount"] = currentValue;
        }
      })

    });

    calculateResults(selectedFish);

    // Set selects to correct value
    $(this).val(currentValue)

    updateResultsInputs()

  });

  // Recalculate results when serving ounces changes
  $(document).ready().on('change', '#fishResults select', function () {

    // Get select id and value

    let currentSelect = $(this).attr("data-id");

    let currentValue = $(this).val();

    // Set fish results select lists to correct amounts via a data attribute
    $('#selectedFish select').each(function () {
      thisFish = $(this).attr("data-id")
      if ($(this).attr("data-id") === currentSelect) {
        $(this).val(currentValue)
      }

      // Update the data with the correct value
      selectedFish.map((currentSelect, i) => {
        if (currentSelect === thisFish) {
          selectedFish[i]["serving-ounces"] = currentValue;
        }
      })
    });

    // Recalculate and render the page
    calculateResults(selectedFish);

    // Set selects to correct value
    updateResultsInputs()


  });

  // Match select lists to their set values
  function updateResultsInputs() {

    //Compare each element in that array to it's ID match in fishResults
    var myStringArray = $('#selectedFish select');
    var arrayLength = myStringArray.length;
    for (var i = 0; i < arrayLength; i++) {
      if ( $('#selectedFish select:eq(' + i +')').attr("data-id") === $('#fishResults select:eq(' + i +')').attr("data-id")) {
        $('#fishResults select:eq(' + i +')').val( $('#selectedFish select:eq(' + i +')').val() )
      }
    }

  };

  // Filter list of fish
  function filterFishList() {
    var input, filter, table, tr, label, i, txtValue;
    input = document.getElementById("filterFish");
    filter = input.value.toUpperCase();
    table = document.getElementById("fishList");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      label = tr[i].getElementsByTagName("label")[1];
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
  $("#filterFish").keyup(filterFishList);

  // Sort list of fish
  function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("fishList");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
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

  // Sort by name
  $(document).ready().on('click', '#fishlistSortName', function () {
    sortTable(1)
  });

  // Sort by mercury level
  $(document).ready().on('click', '#fishlistSortMercury', function () {
    sortTable(2)
  });

  $(document).ready(function () {

    // Calculate results when user clicks "Show Results"
    document.getElementById("showResults").addEventListener("click", function (event) {

      // Don't reload the page
      event.preventDefault()

      // Calculate results
      calculateResults(selectedFish)

      // Update the user inputs on the results page to match those on the selection page

      // Select lists - generic function to change selected value
      function selectElement(id, valueToSelect) {
        let element = document.getElementById(id);
        element.value = valueToSelect;
      }

      // Set fish results select lists to correct amounts via a data attribute
      $('#fishResults select').each(function () {
        selectElement($(this).attr('id'), $(this).data('servings'))
      });

      // Hide selection page/show results
      $(".question-two").addClass("display-none")
      $(".results").removeClass("display-none")
      window.scrollTo(0, 0);
    })

    // Accordion
    var acc = document.getElementsByClassName("accordion-trigger");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if ($(panel).hasClass("active")) {
          $(panel).removeClass("active");
        } else {
          $(panel).addClass("active");
        }
      });
    }

  });

});

