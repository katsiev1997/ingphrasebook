"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPhrasesRequest } from "../api/search-phrases-request";

export const useSearchPhrases = (query: string) => {
	return useQuery({
		queryKey: ["phrases", "search", query],
		queryFn: () => searchPhrasesRequest(query),
		enabled: query.length > 0,
	});
}; 