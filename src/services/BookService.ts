import { SearchResponse } from "@/Models/Book";

export async function searchAllBooks(query: string, page: number = 0): Promise<SearchResponse> {
  try {
    const request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyCmqHggyzAjtJaO1nrtuXR-V0zLgRgLXHo`)
    const todos = await request.json();    
    return todos;
  } catch (e) {
    console.log('Fetch Call Failed', e);
    return {} as SearchResponse;
  }
}