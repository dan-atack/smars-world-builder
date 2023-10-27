import { CONSTANTS, Resource, ModuleInfo } from "./constants";

// Requests a list of the names, types and IDs of all modules in the smars database
export const getModules = (setter: (status: number, data?: []) => void) => {
    const url = `${CONSTANTS.URL_PREFIX}/get-modules`;
    fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
        }
    })
    .then((res) => {
        return res.json();
    })
    .then((response) => {
        if (response.status === 200 && response.data) {
            console.log(response.data);
            setter(response.status, response.data)  // Send the status and the list of modules if the login is successful
        } else {
            console.log("ERROR: Something went wrong trying to retrieve module data. Here's the response sent by the server:");
            console.log(response);
            setter(response.status, []);    // Otherwise just send status code and an empty list
        }
    })
}

// Sends a module ID as a url parameter and gets back the full data object for that module
export const getOneModule = (id: string, setter: (status: number, data?: ModuleInfo) => void) => {
    const url = `${CONSTANTS.URL_PREFIX}/get-module-data/${id}`;
    fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
        }
    })
    .then((res) => {
        return res.json();
    })
    .then((response) => {
        if (response.status === 200 && response.data) {
            console.log(response.data);
            setter(response.status, response.username)  // Send the status and the username if the login is successful
        } else {
            console.log(`ERROR: Something went wrong trying to retrieve data for module ${id}. Here's the response sent by the server:`);
            console.log(response);
            setter(response.status);    // Otherwise just send status code
        }
    })
}

// TODO: Adapt from login context 
// export const addNewModule = (setter: (status: number, modules: []) => void) => {
//     const url = `${CONSTANTS.URL_PREFIX}/login`;
//     fetch(url, {
//         method: "POST",
//         body: JSON.stringify(loginRequest),
//         headers: {
//             Accept: "application/json",
//             'Content-Type': "application/json",
//         }
//     })
//     .then((res) => {
//         return res.json();
//     })
//     .then((response) => {
//         if (response.username) {
//             setter(response.status, response.username)  // Send the status and the username if the login is successful
//         } else {
//             setter(response.status);    // Otherwise just send status code
//         }
//     })
// }