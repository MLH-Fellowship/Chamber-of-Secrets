import axios from "axios"
import { serverUrl } from './config'

export function setTokenHeader(token) {
    /**
     * Sets default authorization header to all outgoing request from axios
     * If token exists, Authorization header is set to JWT token and sent along in all requests
     * If token is false, Authorization header is deleted
     * Args-
     *      token: JWT Token
     */
    if (token) {
        axios.defaults.headers.common["Authorization"] = `JWT ${token}`
    } else {
        delete axios.defaults.headers.common["Authorization"]
    }
}

export function apiCall(method, path, data, headers = {}) {
    /**
     * Centralized function for making network calls using axios
     * Args-
     *      method: HTTP Method- get, post, put etc
     *      path: request endpoint
     *      data: body of the request
     *      headers: additional headers (besides authorization) to be sent with request
     *               defuault value is an empty object
     */
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
    /**
     * Customized function for making network call to upload route
     * Args-
     *      path: request endpoint
     *      form_data: FormData object containing filename and file content
     */
    var res = await axios.post(`${serverUrl}${path}`, form_data, {
        headers: {
            'content-type': 'multipart/form-data',
        }
    })
    var data = res.data
    return data;
}