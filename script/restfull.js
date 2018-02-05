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

function getCookieWithCSRF() {
    $.ajax({
        method: "GET",
        url: url_to_use,
        success: function( response ) {
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Error in cookie: " + errorThrown);
        }

    });

}

function get_json_using_ajax(url_to_use) {

    $.ajax({
        method: "GET",
        contentType: 'application/json',
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

function post_json_using_ajax(data_out, url_to_use) {
    var key = $("#API_key").val()
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        method: "POST",
        "X-CSRFToken": csrftoken,
        xhrFields: {
            withCredentials: false
        },
        crossDomain:true,
        url: url_to_use,
        headers: {
            Authorization: key
        },
        data: data_out,
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

    var base_url = $("#base_url").val() + "resources/";

    // Get the CSRF -token from cookie
    var csrftoken = getCookie('csrftoken');

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                xhr.setRequestHeader("Content-Type","application/json");
                xhr.setRequestHeader("Accept","text/json");
            }
        }
    });


    // This gets the contacts JSON from server and inserts it into the index.html
    $("#contacts").click( function () {
        var url_to_use = base_url + 'contacts/'
        get_json_using_ajax(url_to_use);

    });

    // get data on a single game
    $("#game").click( function () {
        var game_slug = $("#game_slug").val()
        if (game_slug) {
            var url_to_use = base_url + "game/" + game_slug
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
            url_to_use = url_to_use + "games_for_sale_dev/" + dev_id + "/"
        } else {
            url_to_use = url_to_use + "games_for_sale/"
        }
        get_json_using_ajax(url_to_use);
    });


    // This gets the sales statistics for a game or all games as JSON from server and inserts it into the index.html
    $("#sales_stats").click( function () {
        var game_slug = $("#game_slug").val()
        var url_to_use = base_url + 'sales_stats/'
        if (game_slug) {
            url_to_use = url_to_use + game_slug
        }
        post_json_using_ajax({}, url_to_use);
    });


    // This tries to delete a game. Response from server as JSON and inserts it into the index.html
    $("#delete_game").click( function () {
        var game_slug = $("#game_slug").val()
        if (game_slug) {
            var url_to_use = base_url + 'delete_game/'
            url_to_use = url_to_use + game_slug + "/"
            post_json_using_ajax({}, url_to_use);
        } else {
            $("#result").html("no game id given");
        }
    });

    function get_game_vars(){
        var data = {};
        var slug = $("#game_slug").val();
        if (!slug) {
            slug = "";
        }
        data.slug = slug;
        data.game_url = $("#game_url").val();
        data.game_title = $("#game_title").val();
        data.game_description = $("#game_description").val();
        data.game_price = $("#game_price").val();
        data.game_available = $("#game_available").val();
        data.game_pic_url = $("#game_pic_url").val();
        return data;
    }

    $("#add_game").click( function () {
        var game_data = get_game_vars();
        var url_to_use = base_url + 'add_game/'
        post_json_using_ajax(game_data, url_to_use)
    });

    $("#modify_game").click( function () {
        var game_data = get_game_vars();
        var game_slug = $("#game_slug").val()
        var url_to_use = base_url + 'modify_game/' + game_slug + "/"
        post_json_using_ajax(game_data, url_to_use)

    });


    // Request the service to set the resolution of the
    // iframe correspondingly
    var message =  {
        messageType: "SETTING",
        options: {
            "width": 800,
            "height": 600
        }
    };
    window.parent.postMessage(message, "*");

});
