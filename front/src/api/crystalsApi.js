const BASE_URL = "http://localhost:5043/api/crystals";


function getUser() {
  const raw = localStorage.getItem("testflow_auth_user");
  return raw ? JSON.parse(raw) : null;
}


function getUserId() {
  const user = getUser();
  return user?.id;
}


export async function getCrystals() {
  const userId = getUserId();

  if (!userId) throw new Error("User not found");

  const res = await fetch(`${BASE_URL}?userId=${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch crystals");
  }

  return await res.json();
}


export async function addCrystals(amount) {
  const userId = getUserId();

  if (!userId) throw new Error("User not found");

  const res = await fetch(
    `${BASE_URL}/add?userId=${userId}&amount=${amount}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add crystals");
  }

  return await res.json();
}


export async function spendCrystals(amount) {
  const userId = getUserId();

  if (!userId) throw new Error("User not found");

  const res = await fetch(
    `${BASE_URL}/spend?userId=${userId}&amount=${amount}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to spend crystals");
  }

    const data = await res.json();

    return data.payload;
}