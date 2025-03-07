import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api", // Update with your server's base URL
});

// https://api.rabaat.com/api

// Fetch all cities
export const fetchCities = async () => {
  const response = await api.get("/cities");
  return response.data; // Return the cities data
};

// Fetch all Banks
export const fetchallBanks = async () => {
  const response = await api.get("/allbanks");
  return response.data; // Return the cities data
};

// Function to get the list of cards based on the selected bank
export const getCardsByBank = async (bankName) => {
  try {
    const response = await api.get(`/cards/${bankName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards for bank ${bankName}:`, error);
    throw error;
  }
};

// Fetch city details by cityId
export const fetchCityById = async (cityId) => {
  const response = await api.get(`/cities/${cityId}`);
  return response.data;
};

// Fetch city details by cityName
export const fetchCityByName = async (cityName) => {
  const response = await api.get(`/cityByName/${cityName}`);
  return response.data;
};

// Fetch banks for a specific city
export const fetchBanksByCity = async (cityId) => {
    const response = await api.get(`/banks/${cityId}`);
    return response.data;
};

// Fetch banks for a specific city by City Name
export const fetchBanksByCityName = async (cityName) => {
  const response = await api.get(`/banksByCityName/${cityName}`);
  return response.data;
};

// Fetch Cards for a Merchant in a City and Bank
export const fetchCardsForMerchant = async (merchantId, bankId, cityId) => {
  const response = await api.get(`/cards/${merchantId}/${bankId}/${cityId}`);
  return response.data;
};

// Fetch Branches for a Merchant in a City
export const fetchBranchesForMerchant = async (merchantName, cityName) => {
  const response = await api.get(`/branches/${merchantName}/${cityName}`);
  return response.data;
};

// Fetch Branches Count for a Merchant in a City
export const fetchBranchCount = async (merchantName, cityName) => {
  try {
    const response = await api.get(`/branch-count/${merchantName}/${cityName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching branch count:", error);
    return null;
  }
};

export const fetchMaximumDiscount = async (merchantName, bankName, cityName) => {
  try {
    const response = await api.get(`/maximum-discount/${merchantName}/${bankName}/${cityName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maximum discount:", error);
    return null;
  }
};

export const fetchMaximumDiscountAnyBank = async (merchantName, cityName) => {
  try {
    const response = await api.get(`/maximum-discount-any-bank/${merchantName}/${cityName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maximum discount:", error);
    return null;
  }
};

export const fetchMaximumDiscountBankAndCard = async (merchantName, cityName, bankName, cardName) => {
  try {
    const response = await api.get(`/maximum-discount-specific-bank-card/${merchantName}/${cityName}/${bankName}/${cardName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maximum discount:", error);
    return null;
  }
};


export const fetchMerchantsByCity = async (cityName) => {
  const response = await api.get(`/merchants/${cityName}`);
  return response.data;
};

export const fetchMerchantsByCityBankAndCard = async (CityName,bankName,cardName) => {
  const response = await api.get(`/merchantsbycitybankandcard/${CityName}/${bankName}/${cardName}`);
  return response.data;
};

// Fetch Discounts for a Merchant in a City and Bank
export const fetchDiscountsForMerchant = async (merchantName, bankName, cityName) => {
  const response = await api.get(`/discounts/${merchantName}/${bankName}/${cityName}`);
  return response.data;
};

// Fetch Discounts for a Merchant in a City and Bank and Card
export const fetchDiscountsForMerchantForCard = async (merchantName, bankName, cityName, cardName) => {
  const response = await api.get(`/cardDiscounts/${merchantName}/${bankName}/${cityName}/${cardName}`);
  return response.data;
};


export const fetchDiscountDetail = async (discountId) => {
  const response = await api.get(`/discounts/${discountId}/details`);
  return response.data;
};

// Fetch Discounts for a Branch
export const fetchDiscountsForBranch = async (branchId, merchantName, bankName, cityName) => {
  const response = await api.get(`/branch-discounts/${merchantName}/${bankName}/${cityName}/${branchId}`);
  return response.data;
};

export const fetchMerchantByMerchantName = async (merchantName) => {
  const response = await api.get(`/merchant/${merchantName}`);
  return response.data;
};

export const fetchBranchByBranchId = async (branchId) => {
  const response = await api.get(`/branch/${branchId}`);
  return response.data;
};

export const fetchBankByBankId = async (bankId) => {
  const response = await api.get(`/bank/${bankId}`);
  return response.data;
};

export const fetchBankByBankName = async (bankName) => {
  const response = await api.get(`/bankbyName/${bankName}`);
  return response.data;
};

export const fetchMerchantSearchResults = async (cityId, keyword) => {
  const response = await api.get(`/merchants-search/${cityId}/${keyword}`);
  return response.data;
};


export const fetchDiscountBanks = async (cityName, merchantName) => {
  const response = await api.get(`/branch-details/${cityName}/${merchantName}`);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const signupUser = async (data) => {
  const response = await api.post("/signup", data);
  return response.data;
};

