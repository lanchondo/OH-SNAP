//click on food restriction icon and triggers api 
//also has array of food ingredients for food search and food restriction diet

//ingredients for recipe search
var ingredients=[];

$('.food-icon-restr').on('click', function() {
   var restrictDietChoice = this.id;
   runRestrictedDietAPI(restrictDietChoice, ingredients);
});

//runs restricted diet recipe search API
function runRestrictedDietAPI(restrictDietChoice, ingredients){
   var strIngredient = "";
   //concats array with wildcard for better api search
   $.each(ingredients, function(index,value){
       strIngredient += value +"%20";
   })
   var queryURL = `https://api.edamam.com/search?q=${strIngredient}&health=${restrictDietChoice}&app_id=2e4ce701&app_key=20b246a2d182f864dd85c155afc277d3`
   $.ajax({
       url: queryURL,
       method: "GET"
     }).done(function(response) {
       createRecipeCards(response);
     });    
};

   function createRecipeCards(response){
    // $(".cardGroup").empty();
       $.each(response.hits, function(index, value){
        var hits = index;
          $(".cardGroup").append(`
            <div class="recipeCard">
              <div class="imgDiv">
                <img src="${value.recipe.image}" alt="${value.recipe.label}">
              </div>
              <div class="recipeLabel">
                <h5>${value.recipe.label}</h5>
              </div>
              <p class = "cals">Individual Serving Calories:${parseInt(value.recipe.calories/value.recipe.yield)}</p>
              <ul id="${index}">
              </ul>
              <button class="recipeBtn"><a href="${value.recipe.url}">Link to source</a></button>
              <button class="nutBtn"><a href="#">Nutritional Value</a></button>  
            </div>
             `)
            $.each(value.recipe.ingredients, function(index, value){
              $('#'+hits).append(`<li>${value.text}</li>`)  
            })
       });   
   }


 // Pantry Code Below
var pantry = [];
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBk2pHNz0EinDznYAMc6g_quxiE5uByHzQ",
    authDomain: "fir-proj-fc54a.firebaseapp.com",
    databaseURL: "https://fir-proj-fc54a.firebaseio.com",
    projectId: "fir-proj-fc54a",
    storageBucket: "fir-proj-fc54a.appspot.com",
    messagingSenderId: "936997790614"
};
firebase.initializeApp(config);
var database = firebase.database();

function pantryStorage(pantry){
    $.each(pantry, function(index,value){
        var pantryItem = {
            item: value,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }
        database.ref("Pantry").push(pantryItem);
    });
    console.log(`pantry submitted`);
    $("#temporaryPantry").empty();
};

$("#pantry-input").on("click", function(event) {
  event.preventDefault();
      // console.log($("#pantry-add").val().trim());
      pantry.push($("#pantry-add").val().trim());
      console.log(pantry);
      console.log("added to pantry");
      $.each(pantry, function(index,value){
        $("#temporaryPantry").append(`<br> ${value}`);
    });
      //add something tp clear out previour text
  });

$("#pantry-submit").on("click", function(event) {
    console.log("submitting pantry...");
    pantryStorage(pantry);
});

database.ref("Pantry").on("child_added", function(childSnapshot) {
    var item = childSnapshot.val().item;
    var key = childSnapshot.key;
    $(".pantry-current").append(`<span class="pantry-item" id="${key}""><a href='javascript:void(0);' class='remove'>&times;</a>${item}<a href='javascript:void(0);' class='add'>&#10010;</a><br><span>`);
});

$(document).ready(function(){
    $(document).on("click", "a.remove" , function() {
        $(this).parent().remove();
        removeID = $(this).parent().attr("id");
        database.ref("Pantry/" + removeID).remove();
        console.log(`Removed ID: ${removeID}`);
    });
    $(document).on("click", "a.add" , function() {
        $(this).parent().css('background-color', 'gray');
        var item = $(this).parent().text();
        //remove the special characters from the beginning and end of the ingredient
        item = item.slice(0, -1);
        item = item.substr(1);
        console.log(item);
        ingredients.push(item);
    });
});