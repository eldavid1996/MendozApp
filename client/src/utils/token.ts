export function setTokenWithExpiry(token: string, expiryInDays: number) {
  const now = new Date();
  const expiryTime = now.getTime() + expiryInDays * 24 * 60 * 60 * 1000;
  const tokenObject = {
    token: token,
    expiry: expiryTime,
  };
  localStorage.setItem("token", JSON.stringify(tokenObject));
}

export function getToken() {
  const tokenString = localStorage.getItem("token");
  if (!tokenString) {
    return null;
  }

  const tokenObject: { token: string; expiry: number } =
    JSON.parse(tokenString);
  const now = new Date();
  if (now.getTime() > tokenObject.expiry) {
    localStorage.removeItem("token");
    return null;
  }

  return tokenObject.token;
}
