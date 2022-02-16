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

            csv = "\n"
            csv += f'{json_data["id"]},'

            csv += "\""
            title = json_data["title"].replace("\"", "\"\"")
            csv += f'{title}'
            csv += "\","
            
            csv += f'{json_data["budget"]},'
            csv += f'{json_data["revenue"]},'
            
            csv += ";".join([genres["name"] for genres in json_data["genres"]])
            csv += ","

            csv += f'{json_data["original_language"]},'
            csv += f'{json_data["release_date"]},'
            csv += f'{json_data["popularity"]},'
            csv += f'{json_data["vote_average"]},'
            csv += f'{json_data["vote_count"]},'
            csv += f'{json_data["runtime"]}'

            return csv
        else: 
            print("Failed to fetch:", url)
            return None

async def async_fetch():
    with open("movie_details.txt", "w") as output_file:
        output_file.write("id,title,budget,revenue,genres,original_language,release_date,popularity,vote_average,vote_count,runtime")
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
                        print(f'Processed movie #{counter} : {details.split(",")[1]}')
                        output_file.write(details)

print("Fetching movies")
event_loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_fetch())
event_loop.run_until_complete(future)