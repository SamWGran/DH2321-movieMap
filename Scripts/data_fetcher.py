import requests
import json


f = open("movie_ids.txt", "r")
movie_ids = f.read()
movie_ids = movie_ids.split(", ")
url1 = "https://api.themoviedb.org/3/movie/"
url2 = "?api_key=8bd7c4236fae31732aa5b61ce6dbc465&language=en-US"

f = open("movie_details.txt", "w")

for id in movie_ids:
    url = url1+id+url2
    print("Fetching movie id #", id, sep="")
    response = requests.get(url)
    json_data = response.json()

    if (response.status_code == 200):
        del json_data["adult"]
        del json_data["backdrop_path"]
        del json_data["belongs_to_collection"]
        del json_data["homepage"]
        del json_data["poster_path"]
        del json_data["production_countries"]
        del json_data["spoken_languages"]
        del json_data["status"]
        del json_data["tagline"]
        del json_data["original_title"]
        del json_data["video"]
        f.write(json.dumps(json_data, indent=4))
    else : 
        print("Error occured in fetch")
        print(url)


f.close()