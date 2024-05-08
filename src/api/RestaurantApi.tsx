import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// the first time this hook loads, we might not have the reastaurantId on the first render
export const useGetRestaurant = (restaurantId? : string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/${restaurantId}`
    );
    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }
    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    "fetchRestaurant", 
    getRestaurantByIdRequest,
    {
      enabled: !!restaurantId,
    }
  );

  return {restaurant, isLoading};
}

export const useSearchRestaurants = (
    searchState: SearchState,
    city? :string
  ) => {
  const createSearchRequest = async() : Promise<RestaurantSearchResponse>=>{
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","))
    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
    );

    if(!response.ok) {
      throw new Error("Failed to get restaurant")
    }

    return response.json();
  }

  const { data: results, isLoading } = useQuery(
    // searchState改变，会重新请求，会获取新的results
    ["searchRestaurants", searchState], 
    createSearchRequest,
    { enabled: !!city }, // this query is going to run unless we have value for city argument.
  );

  return { results, isLoading }
}