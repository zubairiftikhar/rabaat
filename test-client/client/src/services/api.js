import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api", // Update with your server's base URL
});

// Fetch all cities
export const fetchCities = async () => {
  const response = await api.get("/cities");
  return response.data; // Return the cities data
};

// Fetch banks for a specific city
export const fetchBanksByCity = async (cityId) => {
    const response = await api.get(`/banks/${cityId}`);
    return response.data;
};

// Fetch Cards for a Merchant in a City and Bank
export const fetchCardsForMerchant = async (merchantId, bankId, cityId) => {
  const response = await api.get(`/cards/${merchantId}/${bankId}/${cityId}`);
  return response.data;
};

// Fetch Branches for a Merchant in a City
export const fetchBranchesForMerchant = async (merchantId, cityId) => {
  const response = await api.get(`/branches/${merchantId}/${cityId}`);
  return response.data;
};

export const fetchMerchantsByBankAndCity = async (bankId, cityId) => {
  const response = await api.get(`/merchants/${bankId}/${cityId}`);
  return response.data;
};

// Fetch Discounts for a Merchant in a City and Bank
export const fetchDiscountsForMerchant = async (merchantId, bankId, cityId) => {
  const response = await api.get(`/discounts/${merchantId}/${bankId}/${cityId}`);
  return response.data;
};