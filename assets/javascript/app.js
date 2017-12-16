
$('.food-icon-restr').on('click', function() {
  //diet restriction
   var restrictDietChoice = this.id;
   //ingredients for recipe search
   var ingredients=["chicken","onion","apple"];
   runRestrictedDietAPI(restrictDietChoice, ingredients);
   //items you have in stock to store in firebase
   var pantry = ["garlic", "tomato", "potato", "beef"]
   //adds pantry items to persisting source
   pantryStorage(pantry);
});

//runs restricted diet recipe search API
function runRestrictedDietAPI(restrictDietChoice, ingredients){
   var strIngredient = "";
   //concats array with wildcard for better api search
   $.each(ingredients, function(index,value){
       strIngredient += value +"%20";
   })
   console.log(strIngredient);
   var queryURL = `https://api.edamam.com/search?q=${strIngredient}&health=${restrictDietChoice}&app_id=2e4ce701&app_key=20b246a2d182f864dd85c155afc277d3`
   $.ajax({
       url: queryURL,
       method: "GET"
     }).done(function(response) {
       console.log(response);
       createRecipeCards(response);
     });
     
}
   function createRecipeCards(response){
    $(".cardGroup").empty();
       $.each(response.hits, function(index, value){
        var hits = index;
          $(".cardGroup").append(`
            <div class="recipeCard">
              <div class="imgDiv">
                <img src="${value.recipe.image}" alt="${value.recipe.label}">
              </div>
              <div class="recipeLabel"><h5>${value.recipe.label}</h5></div>
              <p class = "cals">Individual Serving Calories:${parseInt(value.recipe.calories/value.recipe.yield)}</p>
              <ul id="${index}">
              </ul>
              <button class="recipeBtn"><a href="${value.recipe.url}">Link to recipe</a></button>
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
    console.log("pantry submitted");
    })
}
$("#pantry-input").on("click", function(event) {
  event.preventDefault();

      pantry.push($("#pantry-add").val().trim());
      console.log(pantry);
      console.log("added to pantry");
      $("#temporaryPantry").empty();
      $.each(pantry, function(index,value){
        $("#temporaryPantry").append(`<br> ${value}`);
      });

  });

$("#pantry-submit").on("click", function(event) {
    console.log("submitting pantry...");
    pantryStorage(pantry);
});

