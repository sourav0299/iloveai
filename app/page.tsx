'use client';
import { Button } from "@/components/ui/button";
import { SearchBar } from "./components/searchbar";
import CardExamples from "./components/cardslist";

export default function Home() {


  return (
    <>
    <div className="flex flex-col justify-center items-center p-4 mt-40">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Discover Amazing AI Tools</h1>
        <SearchBar />
      </div>
      <div className="py-5">
      </div>
      <CardExamples />
    </div>
    </>
  );
}