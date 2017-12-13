$(document).ready(function(){
  //DOM PLAY
  $("#restrictionsDiv").hide();
  $("#ingredientsDiv").hide();

  $("#restrictionsIntro").on("click", function(){
    $(this).hide();
    $("#pantryIntro").hide();
    $("#restrictionsDiv").show();
  });
  $("#pantryIntro").on("click", function(){
    $(this).hide();
    $("#restrictionsIntro").hide();
    $("#ingredientsDiv").show();
  });

  $("#homeButton").on("click", goHome);

  // function goHome(){
  //   $("#restrictionsDiv").hide();
  //   $("#ingredientsDiv").hide();
  //   $("#pantryIntro").show();
  //   $("#restrictionsIntro").show();
  // }
  
  });
