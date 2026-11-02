
const API_URL = import.meta.env.VITE_API_URL;

async function getData(action) {
  if (!API_URL) {
    throw new Error("Google Apps Script API URL missing.");
  }

  const response = await fetch(`${API_URL}?action=${action}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API request failed.");
  }

  return result;
}

async function postData(data) {
  if (!API_URL) {
    throw new Error("Google Apps Script API URL missing.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "API request failed.");
  }

  return result;
}

export const getHealth = async () => {
  const result = await getData("health");
  return result.database;
};

export const getCategories = async () => {
  const result = await getData("categories");
  return Array.isArray(result.data) ? result.data : [];
};

export const getDistricts = async () => {
  const result = await getData("districts");
  return Array.isArray(result.data) ? result.data : [];
};

export const sendOTP = (mobile) =>
  postData({
    action: "sendOTP",
    mobile,
  });

export const verifyOTP = (mobile, otp) =>
  postData({
    action: "verifyOTP",
    mobile,
    otp,
  });


  
export const submitSubmission = (formData) =>
  postData({
    action: "submitSubmission",
    ...formData,
  });
