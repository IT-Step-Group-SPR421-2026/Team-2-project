

const BASE_URL = "http://localhost:5043/api/CommentReactions";


export async function getLikes(commentId) {
  const res = await fetch(`${BASE_URL}/likes?commentId=${commentId}`);
  const data = await res.json();

  if (!data.isSuccess) throw new Error("Failed to fetch likes");

  return data.payload; 
}


export async function getDislikes(commentId) {
  const res = await fetch(`${BASE_URL}/dislikes?commentId=${commentId}`);
  const data = await res.json();

  if (!data.isSuccess) throw new Error("Failed to fetch dislikes");

  return data.payload; 
}
function getUser() {
  const raw = localStorage.getItem("testflow_auth_user");
  return raw ? JSON.parse(raw) : null;
}

function getUserId() {
  const user = getUser();
  return user?.id;
}


export async function likeComment(commentId) {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authorized");
  }

  await fetch(
    `${BASE_URL}/like?userId=${userId}&commentId=${commentId}`,
    { method: "POST" }
  );
}


export async function dislikeComment(commentId) {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authorized");
  }

  await fetch(
    `${BASE_URL}/dislike?userId=${userId}&commentId=${commentId}`,
    { method: "POST" }
  );
}