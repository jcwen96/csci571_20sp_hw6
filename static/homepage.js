// load the homepage content
function loadPage() {
    fetch("api/slide")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJSON) {
            displaySlide(myJSON, 0);
            var i = 1, base = myJSON.length;
            setInterval(function () {
                displaySlide(myJSON, i++ % base);
            }, 5000);
        })

    fetch("api/wordCloud")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJSON) {
            wordCloud(myJSON);
        })

    fetch("api/cnn")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJSON) {
            for (var i = 0; i < myJSON.length; i++) {
                displayCard(myJSON, "CNN_Headlines", i);
            }
        })

    fetch("api/fox")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJSON) {
            for (var i = 0; i < myJSON.length; i++) {
                displayCard(myJSON, "Fox_Headlines", i);
            }
        })
}

function displaySlide(myJSON, index) {
    // display the image
    document.getElementById("carousel_image").setAttribute("src", myJSON[index].urlToImage);
    // display the title
    document.getElementById("carousel_title").innerText = myJSON[index].title;
    // display the description
    document.getElementById("carousel_description").innerText = myJSON[index].description;
    // add the link
    document.getElementById("carousel").setAttribute("onclick", "window.open(\"" + myJSON[index].url + "\")");
}

function wordCloud(myJSON) {
    // List of words
    var words = [];
    for (var i = 0; i < myJSON.length; i++) {
        var fontSize = 10 + Math.round(myJSON[i][1] / myJSON[0][1] * 40);
        words[i] = { word: myJSON[i][0], size: fontSize };
    }
    // set the dimensions and margins of the graph
    var margin = { top: 5, right: 5, bottom: 5, left: 5 },
        width = 350 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#WordCloud").append("svg").attr("width", 350).attr("height", 300)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // construct a new cloud layout instance. 
    var layout = d3.layout.cloud()
        .size([width, height]).words(words.map(function (word) {
            return { text: word.word, size: word.size };
        })).padding(5)  // space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize(function (word) { return word.size })  // font size of words
        .on("end", draw);
    layout.start();
    // this fuction takes the output of 'layout' above and draw the words
    // wordcloud features that are the SAME from one word to the other can be here
    function draw(words) {
        svg.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text").data(words).enter().append("text")
            .style("font-size", function (word) { return word.size + "px"; })
            .style("fill", "black").attr("text-anchor", "middle")
            .style("font-family", "Impact").attr("transform", function (word) {
                return "translate(" + [word.x, word.y] + ")rotate(" + word.rotate + ")";
            }).text(function (word) { return word.text; });
    }
}

function displayCard(myJSON, source, index) {
    var card = document.getElementById(source).getElementsByClassName("card")[index];
    // display the image
    card.getElementsByTagName("img")[0].src = myJSON[index].urlToImage;
    // display the title
    var title = document.createElement("h3");
    title.innerText = myJSON[index].title;
    card.appendChild(title);
    // display the description
    var description = document.createElement("p");
    description.innerText = myJSON[index].description;
    card.appendChild(description);
    // add the link
    card.setAttribute("onclick", "window.open(\"" + myJSON[index].url + "\")");
}