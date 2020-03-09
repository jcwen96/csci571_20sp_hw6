# Entry point for the application.
from . import app    # For application discovery by the 'flask' command.
from . import callNewsAPI as call
from . import views  # For import side-effects of setting up routes.

from flask import jsonify


# routing endpoint for slide in homepage
@app.route("/api/slide")
def slide():
    call.filterArticle(call.top_headlines)
    return jsonify(call.top_headlines[0:5])

# routing endpoint for word cloud in homepage
@app.route("/api/wordCloud")
def wordCloud():
    return jsonify(call.topWords(call.top_headlines))

# routing endpoint for cards of cnn in homepage
@app.route("/api/cnn")
def cnn():
    call.filterArticle(call.cnn_top)
    return jsonify(call.cnn_top[0:4])

# routing endpoint for cards of fox in homepage
@app.route("/api/fox")
def fox():
    call.filterArticle(call.fox_top)
    return jsonify(call.fox_top[0:4])

# routing endpoint for source in search
@app.route("/api/sources/<category>")
def source(category):
    return jsonify(call.getSources(category)[0:10])

# routing endpoint for search news
@app.route("/api/search/<keyword>/<from_date>/<to_date>/<source>")
def search_News(keyword, from_date, to_date, source):
    print(keyword, from_date, to_date, source)
    return jsonify(call.filterArticle(call.getSearch(keyword, from_date, to_date, source)))