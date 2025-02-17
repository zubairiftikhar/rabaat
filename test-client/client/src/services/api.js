import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api", // Update with your server's base URL
});

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
export const fetchBranchesForMerchant = async (merchantId, cityId) => {
  const response = await api.get(`/branches/${merchantId}/${cityId}`);
  return response.data;
};

// Fetch Branches Count for a Merchant in a City
export const fetchBranchCount = async (merchantId, cityId) => {
  try {
    const response = await api.get(`/branch-count/${merchantId}/${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching branch count:", error);
    return null;
  }
};

export const fetchMaximumDiscount = async (merchantId, bankId, cityId) => {
  try {
    const response = await api.get(`/maximum-discount/${merchantId}/${bankId}/${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maximum discount:", error);
    return null;
  }
};

export const fetchMaximumDiscountAnyBank = async (merchantId, cityId) => {
  try {
    const response = await api.get(`/maximum-discount-any-bank/${merchantId}/${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maximum discount:", error);
    return null;
  }
};

export const fetchMaximumDiscountBankAndCard = async (merchantId, cityId, bankName, cardName) => {
  try {
    const response = await api.get(`/maximum-discount-specific-bank-card/${merchantId}/${cityId}/${bankName}/${cardName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching maximum discount:", error);
    return null;
  }
};


export const fetchMerchantsByCity = async (cityId) => {
  const response = await api.get(`/merchants/${cityId}`);
  return response.data;
};

export const fetchMerchantsByCityBankAndCard = async (CityName,bankName,cardName) => {
  const response = await api.get(`/merchantsbycitybankandcard/${CityName}/${bankName}/${cardName}`);
  return response.data;
};

// Fetch Discounts for a Merchant in a City and Bank
export const fetchDiscountsForMerchant = async (merchantId, bankId, cityId) => {
  const response = await api.get(`/discounts/${merchantId}/${bankId}/${cityId}`);
  return response.data;
};

// Fetch Discounts for a Merchant in a City and Bank and Card
export const fetchDiscountsForMerchantForCard = async (merchantId, bankName, cityId, cardName) => {
  const response = await api.get(`/cardDiscounts/${merchantId}/${bankName}/${cityId}/${cardName}`);
  return response.data;
};


export const fetchDiscountDetail = async (discountId) => {
  const response = await api.get(`/discounts/${discountId}/details`);
  return response.data;
};

// Fetch Discounts for a Branch
export const fetchDiscountsForBranch = async (branchId, merchantId, bankId, cityId) => {
  const response = await api.get(`/branch-discounts/${merchantId}/${bankId}/${cityId}/${branchId}`);
  return response.data;
};

export const fetchMerchantByMerchantId = async (merchantId) => {
  const response = await api.get(`/merchant/${merchantId}`);
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


export const fetchDiscountBanks = async (cityId, merchantId) => {
  const response = await api.get(`/branch-details/${cityId}/${merchantId}`);
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

