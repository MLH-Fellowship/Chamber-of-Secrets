import axios from "axios"
import { serverUrl } from './config'

export function setTokenHeader(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `JWT ${token}`
    } else {
        delete axios.defaults.headers.common["Authorization"]
    }
}

export function apiCall(method, path, data, headers = {}) {
    return new Promise((resolve, reject) => {
        return axios[method](`${serverUrl}${path}`, data, headers)
            .then(res => (resolve(res.data)))
            .catch(err => {
                return reject(err.response.data)
            })
    })
}

export function fileDownloadApiCall(method, path, data, headers = {}) {
    //yet to implement
}

export async function fileUploadApiCall(path, form_data) {
    var res = await axios.post(`${serverUrl}${path}`, form_data, {
        headers: {
            'content-type': 'multipart/form-data',
        }
    })
    var data = res.data
    return data;
}