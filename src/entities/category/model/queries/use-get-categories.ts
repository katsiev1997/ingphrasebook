"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategoriesRequest } from "../api/get-categories-request";

export const useGetCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategoriesRequest(),
	});
};
