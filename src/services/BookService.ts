
import { SearchResponse } from "@/Models/Book";

export const numberOfBooksToRender = 12;

export async function searchAllBooks(query: string, page: number = 0): Promise<SearchResponse> {
  try {
    const startPoint = page * numberOfBooksToRender;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startPoint}&maxResults=${numberOfBooksToRender}&key=AIzaSyCmqHggyzAjtJaO1nrtuXR-V0zLgRgLXHo`;
    const request = await fetch(url)
    const books = await request.json();    
    return books;
  } catch (e) {
    console.log('Fetch Call Failed', e);
    return {} as SearchResponse;
  }
}