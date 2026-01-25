export function getLoggedUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
