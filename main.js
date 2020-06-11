// Navigate
$(function(){
  $("#NextQuestion").click(function(){
    $(".question-one").addClass("display-none")
    $(".question-two").removeClass("display-none")
  });
});

$(function(){
  $("#backToStart").click(function(){
    $(".question-two").addClass("display-none")
    $(".question-one").removeClass("display-none")
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

// Render list of fish from json
$(function () {
  var data = {};
  $.getJSON("fish-list.json")
    .done(function (dat) {
      data = dat;
      console.log("success", dat)
      render();
    })
    .fail(function () {
      console.log("error", arguments);
    })
    .always(function () {
      console.log("complete");
    });

  function render() {
    var template = $("#template").html();
    var html = Mustache.render(template, data);
    $('#fishList').html(html);
  }
});

// Filter list of fish
function filterFish() {
  // Declare variables
  var input, filter, ul, li, checkbox, i, txtValue;
  input = document.getElementById('filterFish');
  filter = input.value.toUpperCase();
  ul = document.getElementById("fishList");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {

    // a = li[i].getElementsByTagName("a")[0];
    checkbox = li[i].getElementsByTagName('label')[0];

    // txtValue = a.textContent || a.innerText;
    txtValue = checkbox.innerText;

    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}


//Render element if checkbox is checked


// The box's status has changed.
$(document).on('change', '.fish', function () {
  //Get checked values
  event.preventDefault();
  var searchIDs = $("#selectFish input:checkbox:checked").map(function(){
    return $(this).val();
  }).get(); // <----

  var chosenFish = {
      selectedFish: searchIDs
  };

  function render() {
    var template = $("#selectedFishTemplate").html();
    var html = Mustache.render(template, chosenFish);
    $('#selectedFish').html(html);
  }

  render();


});

// Select all input text when we focus
$("input[type='number']").on("click", function () {
  $(this).select();
});





