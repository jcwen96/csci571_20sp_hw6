# Entry point for the application.
from . import app    # For application discovery by the 'flask' command.
from . import callNewsAPI as call
from . import views  # For import side-effects of setting up routes.

from flask import jsonify


# routing endpoint for slide in homepage
@app.route("/api/slide")
def slide():
    return jsonify(call.top_headlines())

# routing endpoint for word cloud in homepage
@app.route("/api/wordCloud")
def wordCloud():
    return jsonify(call.topWords())

# routing endpoint for cards of cnn in homepage
@app.route("/api/cnn")
def cnn():
    return jsonify(call.cnn_top())

# routing endpoint for cards of fox in homepage
@app.route("/api/fox")
def fox():
    return jsonify(call.fox_top())

# routing endpoint for source in search
@app.route("/api/sources/<category>")
def source(category):
    return jsonify(call.getSources(category))

# routing endpoint for search news
@app.route("/api/search/<keyword>/<from_date>/<to_date>/<source>")
def search_News(keyword, from_date, to_date, source):
    return jsonify(call.getSearch(keyword, from_date, to_date, source))