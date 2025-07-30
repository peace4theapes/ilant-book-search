"use client";

import { SearchResponse } from "@/Models/Book";
import { searchAllBooks } from "@/services/BookService";
import { useEffect, useState } from "react";
import Image from "next/image";

export const numberOfBooksToRender = 12;

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse|null>(null);
  const [nextPageExists, setNextPageExists] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  
  const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

  function scrollToTop() {
      if (!isBrowser()) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const fetchDataForCurrentPage = async () => {
    // const local = await fetch('http://127.0.0.1:8000');
    // console.log('LLLL', local)
    const booksResponse = await searchAllBooks(query, currentPage);
    let doesNextPageExist = false;
    if(booksResponse.totalItems > numberOfBooksToRender){
      doesNextPageExist = booksResponse.totalItems > (currentPage * numberOfBooksToRender);
    }
    setNextPageExists(doesNextPageExist);
    setSearchResults(booksResponse);
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchDataForCurrentPage();
  };
  
  useEffect(
    () => {
      if(query !== ''){
        fetchDataForCurrentPage();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]
  )
  return (
    <div className="font-sans grid grid-rows-[-200px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex flex-col items-center p=10"> 
          <form className="flex flex-col gap-2 w-full max-w-xs p-10" onSubmit={handleSubmit} role='search'>
              <input 
                  aria-label="Search for a Book" 
                  type="text" 
                  placeholder="Search" 
                  className="text-sm text-gray-base py-2 px-14 border border-gray-200 rounded placeholder: text-center"
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)}  />
              

              <button 
                  type="submit"
                  className="bg-green-400 w-full mt-4">
                  Search
              </button>
          </form>

        
        {searchResults && (
        
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3">
            {searchResults.items.map((book) => {
              return (
                <div key={book.id} className="pt-6">
                  <div className="flow-root bg-light rounded-lg px-4 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center">
                        <Image
                        src={book.volumeInfo.imageLinks?.smallThumbnail || ''}
                        alt={book.volumeInfo.title}
                        unoptimized
                        width={200}
                        height={200}
                        className="max-w-xs transition duration-300 ease-in-out hover:scale-110"            
                        />
                      </div>
                      <div className="text-center justify-center items-center">
                        <h3 className="mt-4 text-lg font-bold w-full break-words overflow-x-auto text-primary tracking-tight">
                          {book.volumeInfo.title}
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-secondary">
                          {book.volumeInfo.authors ? book.volumeInfo.authors[0] : 
                          ''} ({book.volumeInfo.publishedDate})
                        </p>
                        <span className="font-bold text-secondary">
                          Rating: {book.volumeInfo.averageRating}
                        </span>
                        <a
                          href={book.volumeInfo.infoLink}
                          target="_blank"
                          className="mt-4 block text-active underline"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      )}

        {nextPageExists && (
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {currentPage > 0 && (
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"            
            onClick={() => {
              setCurrentPage(currentPage-1)
              scrollToTop();
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            PREVIOUS
          </a>
          )}
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"            
            onClick={() => {
              setCurrentPage(currentPage+1)
              scrollToTop();
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            NEXT
          </a>
        </div>
        )}
        </div>
      </main> 
    </div>
  );
}
