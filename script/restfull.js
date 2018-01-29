// The next two functions are a blatant ripoff from Django documentation
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}




// The base url of the service
var base_url = 'http://127.0.0.1:8000/resources/' // add here the proper URL of the service!

function get_json_using_ajax(url_to_use) {

    var csrftoken = getCookie('csrftoken');
    $.ajax({
        method: "GET",
        contentType: 'application/json',
        "X-CSRFToken": csrftoken,
        xhrFields: {
            withCredentials: false
        },
        crossDomain:true,
        url: url_to_use,
        success: function( response ) {
            clearResult();
            resultTo("Result: " + JSON.stringify(response) );
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            resultTo("Status: " + textStatus); alert("Error: " + errorThrown);
        }

    });
}

function resultTo(response) {
    $("#result").html( response );
}

function clearResult() {
    resultTo("");
}

$(document).ready( function() {
    "use strict";

    // Get the CSRF -token from cookie
    var csrftoken = getCookie('csrftoken');




    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });


    // This gets the contacts JSON from server and inserts it into the index.html
    $("#contacts").click( function () {
        var url_to_use = base_url + 'contacts/'
        get_json_using_ajax(url_to_use);

    });

    // This gets the current user email as JSON from server and inserts it into the index.html
    $("#user_email").click( function () {
        var url_to_use = base_url + 'user/'
        get_json_using_ajax(url_to_use);
    });


    // This gets the current user email as JSON from server and inserts it into the index.html
    $("#game").click( function () {

        var game_id = $("#game_id").val()
        if (game_id) {
            var url_to_use = base_url + "game/" + game_id
            get_json_using_ajax(url_to_use);
        } else {
            $("#result").html("no game id given");
        }
    });


    // this inserts all games on sale to the html or all games put up for sale by a single developer
    $("#games_for_sale").click( function () {

        var dev_id = $("#dev_id").val()
        var url_to_use = base_url
        if (dev_id) {
            url_to_use = url_to_use + "games_for_sale_dev/" + dev_id
        } else {
            url_to_use = url_to_use + "games_for_sale/"
        }
        get_json_using_ajax(url_to_use);
    });


    // This gets the sales statistics for a game or all games as JSON from server and inserts it into the index.html
    $("#sales_stats").click( function () {

        var game_id = $("#game_id").val()
        var url_to_use = base_url + 'sales_stats/'
        if (game_id) {
            url_to_use = url_to_use + game_id
        }
        get_json_using_ajax(url_to_use);
    });


    // This tries to delete a game. Response from server as JSON and inserts it into the index.html
    $("#delete_game").click( function () {
        $("#result").html("");
        var game_id = $("#game_id").val()
        if (game_id) {
            var url_to_use = base_url + 'delete_game/'
            url_to_use = url_to_use + game_id
            get_json_using_ajax(url_to_use);
        } else {
            $("#result").html("no game id given");
        }
    });


/*
    These are still missing

            url
            title
            description
            price
            available
            developer
            created
            updated
            pic_url


    path('add_game/',                views.add_game),
    path('delete_game/<game_id>/',   views.delete_game),
    path('modify_game/<game_id>/',   views.modify_game),
*/


});
