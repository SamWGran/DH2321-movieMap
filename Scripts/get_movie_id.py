import requests
import json
import sys

# Query
url = "https://api.themoviedb.org/3/discover/movie?api_key=8bd7c4236fae31732aa5b61ce6dbc465"
url += "&language=en-US"
url += "&include_video=false"
url += "&include_adult=false"
url += "&with_runtime.gte=41"
url += "&vote_count.gte=10"
url += "&primary_release_date.gte=2018-01-01"
url += "&primary_release_date.lte=2022-01-01"

response = requests.get(url)
response.raise_for_status()

response_json = response.json()
page = response_json["page"]
total_pages = response_json["total_pages"]
movie_ids = []

f = open("movie_ids.txt", "w")

for i in range(page, total_pages):
    print("Accessing page #", i, sep="")
    response = requests.get(f'{url}&page={i}')

    if response.status_code == 200:
        response_json = response.json()
        movies = [movie["id"] for movie in response_json["results"]]
        if i < total_pages-1:
            print(*movies, sep = ", ", end=", ", file=f)
        else:
            print(*movies, sep = ", ", end="", file=f)
        
    else:
        print("Error fetching page #", i, sep="")
        print("HTTP status code ", response.status_code, sep="")

f.close()