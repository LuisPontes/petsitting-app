export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "x-access-token": user.accessToken,
    }; // for Node.js Express back-end
  } else {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    };
  }
}
