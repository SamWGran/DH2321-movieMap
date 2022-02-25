import requests
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor


MAX_WORKER_THREADS = 16

input_file = open("movie_ids.txt", "r")
movie_ids = input_file.read().split(", ")
input_file.close()

def fetch_movie_details(session, movie_id, counter):
    print(f'Fetching movie #{counter}', sep="")
    api_key = "8bd7c4236fae31732aa5b61ce6dbc465"
    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US'

    with session.get(url) as response:
        if response.status_code == 200:
            json_data = response.json()
            if (json_data["budget"] == 0 or json_data["revenue"] == 0):
                return None
            del json_data["adult"]
            del json_data["backdrop_path"]
            del json_data["belongs_to_collection"]
            for genre in json_data["genres"]:
                del genre["id"]
            del json_data["homepage"]
            del json_data["imdb_id"]
            del json_data["original_title"]
            del json_data["overview"]
            del json_data["poster_path"]
            del json_data["production_countries"]
            for company in json_data["production_companies"]:
                del company["logo_path"]
            del json_data["spoken_languages"]
            del json_data["status"]
            del json_data["tagline"]
            del json_data["video"]

            return json_data

            print("Failed to fetch:", url)
            return None

async def async_fetch():
    with open("movie_details.txt", "w") as output_file:
        with ThreadPoolExecutor(max_workers=MAX_WORKER_THREADS) as threads:
            with requests.session() as session:
                event_loop = asyncio.get_event_loop()
                tasks = [
                    event_loop.run_in_executor(
                        threads, 
                        fetch_movie_details, 
                        *(session, movie_ids[i], i+1)
                    ) 
                    for i in range(0, len(movie_ids))
                ]
                counter = 0
                for details in await asyncio.gather(*tasks) :
                    counter += 1
                    if details is not None:
                        print(f'Processed movie #{counter} : {details["title"]}')
                        json.dump(details, output_file)

print("Fetching movies")
event_loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_fetch())
event_loop.run_until_complete(future)