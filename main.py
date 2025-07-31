from fastapi import FastAPI
from mangum import Mangum
import requests

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get('/searchBooks')
async def getBooks(start: int, limit: int, searchString: str):
    api_url = "https://www.googleapis.com/books/v1/volumes?q=%s&startIndex=%d&maxResults=%d&key=AIzaSyCmqHggyzAjtJaO1nrtuXR-V0zLgRgLXHo" % (searchString, start, limit)
    books = requests.get(api_url).json()
    return books

handler = Mangum(app, lifespan="off")