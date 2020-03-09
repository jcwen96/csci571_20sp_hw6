// load default values for form
function loadSearch() {
    var now = new Date();
    document.getElementById("search_to").setAttribute("value", dateToValue(now));
    now.setDate(now.getDate() - 7);
    document.getElementById("search_from").setAttribute("value", dateToValue(now));
    // set the default source
    // getSource("all");
}

function dateToValue(date) {
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return date.getFullYear() + "-" + month + "-" + day;
}
function valueToDate(value) {
    return new Date(value.slice(0, 4), Number(value.slice(5, 7)) - 1, value.slice(8, 10));
}

function displayNews() {
    document.getElementById("search").style.display = "none";
    document.getElementById("homepage").style.display = "block";
    document.getElementById("homepage_button").setAttribute("class", "button active");
    document.getElementById("search_button").setAttribute("class", "button");
}

function displaySearch() {
    document.getElementById("homepage").style.display = "none";
    document.getElementById("search").style.display = "block";
    document.getElementById("search_button").setAttribute("class", "button active");
    document.getElementById("homepage_button").setAttribute("class", "button");
}

// get sources based on category
function getSource(category) {
    fetch("api/sources/" + category)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJSON) {
            var select = document.getElementById("search_source");
            var options = select.childNodes;
            var length = options.length;
            for (var i = 3; i < length; i++) {
                options[3].remove();
            }
            for (var i = 0; i < myJSON.length; i++) {
                option = document.createElement("option");
                option.innerHTML = myJSON[i];
                select.appendChild(option);
            }
        })
}

function search(form) {
    var keyword_encode = encodeURIComponent(form.search_keyword.value);
    var from = valueToDate(form.search_from.value);
    var to = valueToDate(form.search_to.value);
    if (from.getTime() > to.getTime()) {
        alert("Incorrect time");
        event.preventDefault();
        return;
    }
    clearPreResult();
    fetch("api/search/" + keyword_encode +"/"
            + form.search_from.value + "/" + form.search_to.value + "/"
            + form.search_source.value)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJSON) {
            console.log(myJSON);
            if (myJSON.length > 0) {
                displayResult(myJSON);
                if (myJSON.length > 5) {
                    document.getElementById("show_button").style = "display: inline;";
                }
            } else {
                document.getElementById("noResults").style = "display: block";
            }
        })
    event.preventDefault();
}



function displayResult(articles) {
    var cards = document.querySelector("#search_result .cards"); 
    for (var i = 0; i < articles.length; i++) {
        // <div class="card" onclick="clickCard(this);"></div>
        var card = document.createElement("div");
        card.setAttribute("class", "card");
        card.setAttribute("onclick", "clickCard(this, 'block');");
        if (i < 5) {
            card.setAttribute("style", "display: flex");
        }
        cards.appendChild(card);
        // <div class="cardImage"></div>
        var div_image = document.createElement("div");
        div_image.setAttribute("class", "cardImage");
        card.appendChild(div_image);
        var image = document.createElement("img");
        image.setAttribute("src", articles[i].urlToImage);
        image.setAttribute("alt", "Image not available for this result.");
        div_image.appendChild(image);
        // <div class="cardContent"></div>
        var div_content = document.createElement("div");
        div_content.setAttribute("class", "cardContent");
        card.appendChild(div_content);
        var title = document.createElement("h3");
        title.innerHTML = articles[i].title;
        div_content.appendChild(title);
        var author = document.createElement("p");
        author.innerHTML = "<span class='strong'>Author: </span>" + articles[i].author;
        div_content.appendChild(author);
        var source = document.createElement("p");
        source.innerHTML = "<span class='strong'>Source: </span>" + articles[i].source.name;
        div_content.appendChild(source);
        var date = document.createElement("p");
        date.innerHTML = "<span class='strong'>Date: </span>" + articles[i].publishedAt;
        div_content.appendChild(date);
        var description = document.createElement("p");
        description.innerHTML = articles[i].description;
        div_content.appendChild(description);
        var link = document.createElement("a");
        link.setAttribute("href", articles[i].url);
        link.innerHTML = "See Orginal Post";
        div_content.appendChild(link);
        // <div class="cardClose"></div>
        var div_close = document.createElement("div");
        div_close.innerHTML = "×";
        div_close.setAttribute("class", "cardClose");
        div_close.setAttribute("onclick", "clickCard(this.parentElement, 'none');")
        card.appendChild(div_close);
    }
}

function clearPreResult() {
    var cards = document.querySelector("#search_result .cards");
    while (cards.childElementCount > 0) {
        cards.removeChild(cards.children[0]);
    }
}

function hideResult() {
    var cards = document.querySelector("#search_result .cards");
    document.getElementById("noResults").style = "display: none";
    cards.setAttribute("style", "display: none");
    document.getElementById("show_button").style = "display: none;";
}

function clickCard(card, display) {
    card.children[2].setAttribute("style", "display: " + display);
    for (var i = 1; i < 4; i++) {
        card.children[1].children[i].setAttribute("style", "display: " + display);
    }
    card.children[1].children[5].setAttribute("style", "display: " + display);
    if (display == "none") {
        event.stopPropagation();
    } 
}

function showButton() {
    var text = document.getElementById("show_button").innerHTML;
    var cards = document.querySelector("#search_result .cards");
    if (text == "Show More") {
        document.getElementById("show_button").innerHTML = "Show Less";
        for (var i = 5; i < cards.childElementCount; i++) {
            cards.children[i].setAttribute("style", "display: flex");
        }
    } else {
        document.getElementById("show_button").innerHTML = "Show More";
        for (var i = 5; i < cards.childElementCount; i++) {
            cards.children[i].setAttribute("style", "display: none");
        }
    }
}