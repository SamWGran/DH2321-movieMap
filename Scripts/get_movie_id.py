import requests
import json


# Query
url = "https://api.themoviedb.org/3/discover/movie?api_key=8bd7c4236fae31732aa5b61ce6dbc465"
url += "&language=en-US"
url += "&include_video=false"
url += "&include_adult=false"
url += "&with_runtime.gte=41"
url += "&vote_count.gte=10"
url += "&primary_release_date.gte=2018-01-01"
url += "&primary_release_date.lte=2022-01-01"

movies = []
page = 1
total_pages = 2

while page < total_pages:
    print("Accessing page #", page, sep="")
    page_url = url + "&page=" + str(page)
    response = requests.get(page_url)
    if response.status_code == 200:
        json_data = response.json()
        page = json_data["page"]+1
        total_pages = json_data["total_pages"]
        for movie in json_data["results"]:
            movies.append(movie["id"])
    else:
        print("Error fetching page #", page, sep="")
        print("HTTP status code ", response.status_code, sep="")
        exit()

f = open("movie_ids.txt", "w")
print(movies, sep = ", ", file=f)
f.close() 