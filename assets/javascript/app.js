//click on food restriction icon and triggers api 
//also has array of food ingredients for food search and food restriction diet
$('.food-icon-restr').on('click', function() {
       //diet retriction
       var restrictDietChoice = this.id;
        //ingredients for recipe search
        var ingredients=["chicken","onion","apple"];
        runRestrictedDietAPI(restrictDietChoice, ingredients);
        //items you have in stock to store in firebase
        var pantry = ["garlic", "tomato", "potato", "beef", "celery"]
        //adds pantry items to persisting source
        pantryStorage(pantry);
    });

//runs retricted diet recipe search API
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
        //trying to create paging for going to previous 10 or next 10 results
        //not adding functionality currently
            // $('.card-text').on('click', function() {
            //     pageResults(this.id,response);
            // });
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
      // function pantryStorage(pantry){
      //     // Initialize Firebase
      //   var config = {
      //       apiKey: "AIzaSyBk2pHNz0EinDznYAMc6g_quxiE5uByHzQ",
      //       authDomain: "fir-proj-fc54a.firebaseapp.com",
      //       databaseURL: "https://fir-proj-fc54a.firebaseio.com",
      //       projectId: "fir-proj-fc54a",
      //       storageBucket: "fir-proj-fc54a.appspot.com",
      //       messagingSenderId: "936997790614"
      //   };
      //   firebase.initializeApp(config);
      //   var database = firebase.database();
      //   $.each(pantry, function(index,value){
      //       var pantryItem = {
      //           item: value,
      //           dateAdded: firebase.database.ServerValue.TIMESTAMP
      //       }

      //       database.ref("Pantry").push(pantryItem);
      //   })
      // }

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
      // console.log($("#pantry-add").val().trim());
      pantry.push($("#pantry-add").val().trim());
      console.log(pantry);
      console.log("added to pantry");
      $("#temporaryPantry").empty();
      $.each(pantry, function(index,value){
        $("#temporaryPantry").append(`<br> ${value}`);
      });
      //add something tp clear out previour text
  });

$("#pantry-submit").on("click", function(event) {
    console.log("submitting pantry...");
    pantryStorage(pantry);
});

