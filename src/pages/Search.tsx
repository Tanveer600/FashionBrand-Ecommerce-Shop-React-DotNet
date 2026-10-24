import { useState } from "react";
import {
  Button,
  ProductGrid,
  ProductGridWrapper,
  ShowingSearchPagination,
} from "../components";
import { Form, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  return (
    <div className="max-w-screen-2xl mx-auto">
      <Form
        method="post"
        className="flex items-center mt-24 px-5 max-[400px]:px-3"
      >
        <input
          type="text"
          placeholder="Search products"
          defaultValue={searchParams.get("query") || ""}
          className="bg-[#141414] text-white placeholder-neutral-500 border border-white/10 focus:border-amber-500 h-12 text-xl px-3 w-full outline-none max-sm:text-lg transition-colors"
          name="searchInput"
        />
        <div className="w-52 max-sm:w-40 bg-amber-500 hover:bg-amber-400 h-12 flex items-center justify-center transition-colors">
          <Button mode="brown" text="Search" type="submit" />
        </div>
      </Form>

      <ProductGridWrapper searchQuery={searchParams.get("query")!} page={currentPage}>
        <ProductGrid />
      </ProductGridWrapper>

      <ShowingSearchPagination page={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default Search;