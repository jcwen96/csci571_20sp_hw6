from . import app

@app.route("/")
@app.route("/index")
@app.route("/index.html")
def homepage():
    return app.send_static_file("index.html")

@app.route("/style.css")
def style():
    return app.send_static_file("style.css")
@app.route("/homepage.css")
def homepage_css():
    return app.send_static_file("homepage.css")
@app.route("/search.css")
def search_css():
    return app.send_static_file("search.css")

@app.route("/homepage.js")
def homepage_js():
    return app.send_static_file("homepage.js")
@app.route("/search.js")
def search():
    return app.send_static_file("search.js")