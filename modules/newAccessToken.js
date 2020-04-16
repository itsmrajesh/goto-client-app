
/**
 * Geeting Access Token using Refresh token
 */

function getbase64Code() {
    return 'ajdVM25CcGFVeDA4OWJ4NGZJTjVLOG14SWl3MjVZSWM6YjhoZmozdFRSa1MxSlh2TQ==';
}

function getHeaders() {
    const header = new Headers();
    header.append("Authorization", `Basic ${getbase64Code()}`);
    header.append('Accept', 'application/json');
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    return header;
}

function getBody() {
    let code = localStorage.getItem('refreshToken');
    let body = {
        'grant_type': 'refresh_token',
        'code': code
    }

    let formBody = [];

    for (let property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&");

    return formBody;
}

export let generateNewAccessToken = function () {
    fetch('https://api.getgo.com/oauth/v2/token', {
        method: 'POST',
        headers: getHeaders(),
        body: getBody()
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            let res = JSON.stringify(data);
            console.log(res);
            localStorage.setItem('accessRes', res);
            localStorage.setItem("refreshToken", res.refresh_token)
            localStorage.setItem('accessToken', data.access_token);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
