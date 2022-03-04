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
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={api_key}&language=en-US'

    with session.get(url) as response:
        if response.status_code == 200:
            json_data = response.json()
            
            # Add json edits here
            for member in json_data["cast"]:
                del member["adult"]
                del member["cast_id"]
                del member["credit_id"]
                del member["gender"]
                del member["id"]
                del member["order"]
                del member["original_name"]
                del member["profile_path"]
                try: # Vissa crew och cast members har inte denna datapunkt.
                    del member["known_for_department"]
                except: 
                    pass

            for member in json_data["crew"]:
                del member["adult"]
                del member["credit_id"]
                del member["gender"]
                del member["id"]
                del member["original_name"]
                del member["profile_path"]
                try: # Vissa crew och cast members har inte denna datapunkt.
                    del member["known_for_department"]
                except: 
                    pass
            
            return json_data
        else:
            print("Response status code:", response.status_code, "with movie_id:",movie_id)
            print(movie_id)
            return None

async def async_fetch():
    with open("movie_credits.txt", "w") as output_file:
        output_file.write("(")
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
                        print(f'Processed movie #{counter}')
                        json.dump(details, output_file, indent=4, sort_keys=True)
        output_file.write(")")

print("Fetching movies")
event_loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_fetch())
event_loop.run_until_complete(future)