const tokenBtn = document.querySelector("#tokenBtn");

const consumerKey = 'j7U3nBpaUx089bx4fIN5K8mxIiw25YIc';

tokenBtn.addEventListener('click', (event) => {
    let url = `https://api.getgo.com/oauth/v2/authorize?client_id=${consumerKey}&response_type=code`;

    window.open(url, '_blank'); // get auth code from URL
})

const btn = document.querySelector("#authBtn");

var authCode = '';

btn.addEventListener('click', (event) => {
    authCode = document.querySelector("#authCode").value;

    authCode = authCode.trim();

    if (authCode.length > 7)
        getAccessToken();
    else
        alert("Invalid Authorization Code")

})


// Impl to get Access Token using Authorization Code only 1st time users

function getAuthCode() {
    return authCode;
}

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
    let code = getAuthCode();
    let body = {
        'grant_type': 'authorization_code',
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

function getAccessToken() {

    fetch('https://api.getgo.com/oauth/v2/token', {
        method: 'POST',
        headers: getHeaders(),
        body: getBody()
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            if (data) {
                let res = JSON.stringify(data);
                console.log(res);
                localStorage.setItem('accessRes', res);
                localStorage.setItem("refreshToken", res.refresh_token)
                localStorage.setItem('accessToken', data.access_token);
                window.location.href = "dashboard.html";
            }
            else
                alert("Try Again")
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Try Again")
        });
}