'use client';
import { SearchBar } from "./components/searchbar";

export default function Home() {


  return (
    <div className="flex justify-center items-center p-4 h-[500px]">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Discover Amazing AI Tools</h1>
        <SearchBar />
      </div>
    </div>
  );
}