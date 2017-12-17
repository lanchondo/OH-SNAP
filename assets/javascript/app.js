

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