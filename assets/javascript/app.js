

var input = document.getElementById("basics");
var awesomeplete = new Awesomplete(input);


function recipeapicallback(fillData) {
    awesomeplete.list = fillData;
}

$('#basics').on('input', function() {
     var inString = $(this).val();
    getAutocomplete(inString);
});


function getAutocomplete(inString){
    //api needs callback in order to provide return 
    //datatype needs to be set to jsonp
    var queryURL = `http://api.edamam.com/auto-complete?q=${inString}&limit=10&app_id=cb021850&app_key=3f0c4b8c9adcb08d63cbde97230db9f8&callback=recipeapicallback`
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: 'jsonp'
      });
    
};
//click on food restriction icon and triggers api 
//also has array of food ingredients for food search and food restriction diet
   $('.food-icon-restr').on('click', function() {
       //diet retriction
        var restrictDietChoice = this.id;
        //ingredients for recipe search
        var ingredients=["chicken","onion","apple"];
        runRestrictedDietAPI(restrictDietChoice, ingredients);
        //items you have in stock to store in firebase
        //var pantry = ["garlic", "tomato", "potato", "beef"]
        //adds pantry items to persisting source
        //pantryStorage(pantry);
    });

//runs retricted diet recipe search API
    function runRestrictedDietAPI(restrictDietChoice, ingredients){
        var strIngredient = "";
        //concats array with wildcard for better api search
        $.each(ingredients, function(index,value){
            strIngredient += value +"%20";
        })

        var queryURL = `https://api.edamam.com/search?q=${strIngredient}&health=${restrictDietChoice}&app_id=2e4ce701&app_key=20b246a2d182f864dd85c155afc277d3`;
        $.ajax({
            url: queryURL,
            method: "GET"
          }).done(function(response) {
            createRecipeCards(response);
          });
        
          
    }

    //changes results
     //not adding functionality currently
        // function pageResults(id,response){
        //     if(id == "next"){
        //         if(response.from == response.count - (response.count%10)){
        //             console.log(response.to);
        //             console.log(response.from);
        //         }
        //     }else{
        //         //previous results
        //         if(response.from > 10){
        //             console.log(response.to);
        //             console.log(response.from);
        //         }
        //     } 
        // }
       
        
        function createRecipeCards(response){
            $(".card-group").empty();
            $.each(response.hits, function(index, value){
                var hits= index;
                $(".card-group").append(`
                <div class="card border-primary mb-3" style="max-width: 20rem;">
                <div class="card-header">${value.recipe.label}</div>
                <div class="card-body text-primary">
                    <img src="${value.recipe.image}" alt="${value.recipe.label}" height="42" width="42">
                    <h2 class="card-title">Total Calories:${parseInt(value.recipe.calories)}</h2>
                    <h3 class="card-title">Individual Serving Calories:${parseInt(value.recipe.calories/value.recipe.yield)}</h3>
                    <ul class="ingr-list" id="${index}"></ul> 
                    <a href="${value.recipe.url}">Diretions to make this</a>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
                `)
                  $.each(value.recipe.ingredients, function(index, value){
                    $('#'+hits).append(`<li>${value.text}</li>`)  
                  })
            });
        }

      function pantryStorage(pantry){
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
        $.each(pantry, function(index,value){
            var pantryItem = {
                item: value,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            }
        
            database.ref("Pantry").push(pantryItem);
        })
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
      // pantry.push($("#pantry-add").val().trim());
      pantry.push($("#basics").val().trim());
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
    var expirationDT = moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm:ss');
    var item = childSnapshot.val().item;
    var key = childSnapshot.key;
    if(moment(childSnapshot.val().dateAdded).format('YYYY/MM/DD HH:mm:ss') < expirationDT){
        $(".pantry-current").append(`<span class="pantry-item" id="${key}""><a href='javascript:void(0);' class='remove'>&times;</a>${item} Please check item for freshness!<a href='javascript:void(0);' class='add'>&#10010;</a><br><span>`);
    }else{
        $(".pantry-current").append(`<span class="pantry-item" id="${key}""><a href='javascript:void(0);' class='remove'>&times;</a>${item}<a href='javascript:void(0);' class='add'>&#10010;</a><br><span>`);
    }
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
        //remove the special characters fromt he beginning and end of the ingredient
        item = item.slice(0, -1);
        item = item.substr(1);
        console.log(item);
        ingredients.push(item);
    });
});