import axios from "axios";

export async function getDataWithoutToken(url) {
  return await axios({
    method: "get",
    url: url,
  }).then((res) => res.data);
}

export async function getData(url, token) {
  return await axios({
    method: "get",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.data);
}

export async function getDataWithParams(url, token, params) {
  return await axios({
    method: "get",
    url: url,
    params: params,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => res.data);
}

export async function postData(url, token, reqData) {
  return await axios
    .post(url, reqData, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => res.data);
}

export async function deleteData(url, token) {
  return await axios
    .delete(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => res.data);
}

export async function putData(url, token) {
  return await axios
    .put(url, "", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => res.data);
}

export async function paymentRequestData(url, serverKey, reqData) {
  return await axios
    .post(url, reqData, {
      headers: {
        Authorization: serverKey,
      },
    })
    .then((res) => res.data);
}
