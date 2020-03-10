from newsapi import NewsApiClient, newsapi_exception
import string, re

# Init Google News API
newsapi = NewsApiClient(api_key="46e244b92cdf4153aa0a84572d96f437")

# obtain the top headlines in general for homepage
def top_headlines():
    try:
        return filterArticle(newsapi.get_top_headlines(page_size=100)["articles"])[0:5]
    except:
        return        

# obtain cnn headlines for homepage
def cnn_top():
    try:
        return filterArticle(newsapi.get_top_headlines(sources='cnn', page_size=30)["articles"])[0:4]
    except:
        return

# obtain fox-news headlines for homepage
def fox_top():
    try:
        return filterArticle(newsapi.get_top_headlines(sources='fox-news', page_size=30)["articles"])[0:4]
    except:
        return

# find the top 30 frequent words from the title of the news article
def topWords():
    try:
        articles = newsapi.get_top_headlines(page_size=100)["articles"]
        stopWords = set(open('stopwords_en.txt', 'r').read().split())
        count = dict()
        for article in articles:
            if "title" not in article or article["title"] is None or article["title"] is "":
                continue
            title = re.sub(r'(?=\B)[^ \w]|[^ \w](?=\B)', '', article["title"])
            for word in title.split():
                if word.lower() not in stopWords:
                    count[word] = count.get(word, 0) + 1
        frequency = sorted(count.items(), key = lambda item:item[1], reverse = True)
        return frequency[0:30]
    except newsapi_exception.NewsAPIException as e:
        print(e)
        return

# filter articles with non-null author, description, title, url, urlToImage,
# publishedAt and source with its inner key
# PRE: type(articles) should be a list
def filterArticle(articles):
    filter_result = []
    for article in articles:
        if not(article["author"] == None or article["author"] == "" or
            article["description"] == None or article["description"] == "" or
            article["title"] == None or article["title"] == "" or
            article["url"] == None or article["url"] == "" or
            article["urlToImage"] == None or article["urlToImage"] == "" or
            article["publishedAt"] == None or article["publishedAt"] == "" or
            article["source"]["name"] == None or article["source"]["name"] == ""):
            filter_result.append(article)
    return filter_result

# obtain all the sources based on category
def getSources(category):
    try:
        if category == "all":
            sources = newsapi.get_sources(language='en', country='us')["sources"]
        else:
            sources = newsapi.get_sources(language='en', country='us', category=category)["sources"]
        sourceList = []
        for source in sources:
            sourceList.append(source["name"])
        return sourceList[0:10]
    except newsapi_exception.NewsAPIException as e:
        return

# obtain news based on form fields
def getSearch(keyword, from_date, to_date, source):
    try:
        if source == "all":
            source = ""
        result = newsapi.get_everything(q=keyword, sources=source, language='en',
                                        from_param=from_date, to=to_date,
                                        page_size=30, sort_by="publishedAt")
        return filterArticle(result["articles"])[0:15]
    except newsapi_exception.NewsAPIException as e:
        print(e)
        return e.get_message()