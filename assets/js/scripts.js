$(document).ready(function(){
  $('.movies-list').slick({
    variableWidth: true,
    prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
  });

  $("#modal .icon-close").click(function(){
    $("#modal").fadeOut("fast");
  });

  $("#player .icon-close").click(function(){
    $("#player").fadeOut("fast");
  });

  var KEY = "4ba13f07eb7d66f818df7d9bf080d2e8";
  var URL = "https://api.themoviedb.org/3/";
  var BACKDROP = "https://image.tmdb.org/t/p/original";
  var POSTER = "https://image.tmdb.org/t/p/w185";
  var POSTER_MODAL = "https://image.tmdb.org/t/p/w500";

  $.ajax(URL + "discover/movie?language=pt-BR&api_key=" + KEY)
    .done(function(res){
      var movie = res.results[0];
      var list = res.results;
      list.shift();

      var title = movie.title;
      var rate = movie.vote_average;
      var backdrop = BACKDROP + movie.backdrop_path;
      var id = movie.id;

      $("#main-title").html(title);
      $("#main-rate").html(rate);
      $("#main-backdrop").css("background-image", "url("+ backdrop +")");
      $("#play-main").attr("data-id", id);

      for(var i=0; i < list.length; i++){
        var id = list[i].id;
        var title = list[i].title;
        var rate = list[i].vote_average;
        var poster = POSTER + list[i].poster_path;

        var item = '<div class="movies-item" data-id="'+id+'" data-type="MOVIE">';
        item += '<div class="movies-info">';
        item += '<i class="far fa-play-circle"></i>';
        item += '<h3>'+title+'</h3>';
        item += '<div class="rating">';
        item += '<div class="rating-rate">'+rate+'</div>';
        item += '</div></div>';
        item += '<img src="'+poster+'" alt="'+title+'">';
        item += '</div>';

        $("#popular-movies").slick("slickAdd", item);
      }
    });

  $.ajax(URL + "discover/tv?language=pt-BR&api_key=" + KEY)
    .done(function(res){
      var list = res.results;
      
      for(var i=0; i < list.length; i++) {
        var id = list[i].id;
        var title = list[i].name;
        var rate = list[i].vote_average;
        var poster = POSTER + list[i].poster_path;

        var item = '<div class="movies-item" data-id="'+id+'" data-type="TV">';
            item += '<div class="movies-info">';
            item += '<i class="far fa-play-circle"></i>';
            item += '<h3>'+title+'</h3>';
            item += '<div class="rating">';
            item += '<div class="rating-rate">'+rate+'</div>';
            item += '</div></div>';
            item += '<img src="'+poster+'" alt="'+title+'">';
            item += '</div>';

        $("#popular-tv").slick("slickAdd", item);
      }
    })
  
  $.ajax(URL + "discover/movie?language=pt-BR&with_genres=12&api_key=" + KEY)
    .done(function(res){
      var list = res.results;
      
      for(var i=0; i < list.length; i++) {
        var id = list[i].id;
        var title = list[i].title;
        var rate = list[i].vote_average;
        var poster = POSTER + list[i].poster_path;

        var item = '<div class="movies-item" data-id="'+id+'" data-type="MOVIE">';
            item += '<div class="movies-info">';
            item += '<i class="far fa-play-circle"></i>';
            item += '<h3>'+title+'</h3>';
            item += '<div class="rating">';
            item += '<div class="rating-rate">'+rate+'</div>';
            item += '</div></div>';
            item += '<img src="'+poster+'" alt="'+title+'">';
            item += '</div>';

        $("#popular-adventure").slick("slickAdd", item);
      }
    })

    .fail(function(error){
      console.error("Deu ruim!", error);
      $("#popular-adventure").html("<p>Erro "+error.status+": Tente novamente mais tarde</p>");
    });

  var firstLoad = false;

  $(window).load(function() {
    $(".loading").fadeOut("slow");
    firstLoad = true;
  });

  $(document).ajaxComplete(function() {
    if (firstLoad){
      $(".loading").fadeOut("slow");
    }
  });

  $(document).ajaxStart(function() {
    $(".loading").fadeIn("slow");
  });

  $(".movies-list").on("click", ".movies-item", function() {
    var id = $(this).data("id");
    var type = $(this).data("type");
    openMovie(id, type);
  })

  function openMovie(movieId, type) {
    $("#modal").fadeIn("fast");
    var id = movieId;

    var api; 
   
    switch(type) {
      case "MOVIE":
        api = URL + "movie/"+id;
        break;
      case "TV":
        api = URL + "tv/"+id;
        break;
        default:
        return;
    }

    $.ajax(api + "?language=pt-BR&api_key=" + KEY)
      .done(function(res) {
        console.log(res);  
        var poster = res.poster_path;
        var title = res.title || res.name;
        

        $("#modal .modal-poster-img").html('<img src=" '+ POSTER_MODAL + poster +' ">');
        $("#modal .modal-title").html(title);
        $("#modal .modal-original-title").html("(" + res.original_title + ")");
        $("#modal .modal-tagline").html(res.tagline);
        $("#modal .modal-overview").html(res.overview);
        $("#modal .rating-rate").html(res.vote_average);
        $("#modal .movie-time span").html(res.runtime + " min");
        $("#modal .movie-homepage a").html(res.homepage).attr("href", res.homepage);
      })
    
    $("#modal .modal-poster-play").click(function() {
      $("#player").fadeIn("fast");
      var widthPlayer = window.innerWidth;
      var heightPlayer = window.innerHeight;
      
      $("#player iframe").attr("width", widthPlayer).attr("height", heightPlayer);

      $.ajax(api + "/videos?language=pt-BR&api_key=" + KEY)
        .done(function(res) {
          if ( res.length ) {
          var movie = res.results[0].key;
          $("#player iframe").attr("src", "https://www.youtube.com/embed/" + movie + "?autoplay=1");
        } else {
          $("#player").fadeOut("fast");
          alert("Erro: Filme Indisponível");
        }
        })
    });
  }
});