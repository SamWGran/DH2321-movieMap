import requests
import json


base_url = "https://api.themoviedb.org/3/discover/movie?api_key=8bd7c4236fae31732aa5b61ce6dbc465&include_adult=false&include_video=false"

# Inputs
lang = "&language=en-US"
release_dates= "&primary_release_date.gte=2018-01-01&primary_release_date.lte=2022-01-01"
remove_short_films = "&with_runtime.gte=41&vote_count.gte=10"

url = base_url + lang + release_dates + remove_short_films

print(url)
print("Status: ", end="")
print(response)
movies_page = response.json()

# Outputs
page = movies_page["page"]
total_pages = movies_page["total_pages"]
movies = movies_page["results"]
total_movies = movies_page["total_results"]


 
# Print json data
print("page: ", end="")
print(page)
print("total pages: ", end="")
print(total_pages)
print("movies: ", end="")
print(len(movies))
print("total movies: ", end="")
print(total_movies)
