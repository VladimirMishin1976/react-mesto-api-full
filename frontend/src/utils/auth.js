export const BASE_URL = 'http://api.mesto15.student.nomoredomains.club';

//  проверка ответа
const checkResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`Ошибка: ${res.status}`);
}

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    credentials: "include",
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password, email })
  }).then(checkResponse);
}

export const authorize = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    credentials: "include",
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password, email })
  }).then(checkResponse);
}

export const checkToken = () => {
  return fetch(`${BASE_URL}/users/me`, {
    credentials: "include",
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    }
  }).then(checkResponse);
}