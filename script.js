async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

const API_KEY = '6zXQ5n3xF-ZKs-mHV_yZ';

async function loadStock() {
    let today = new Date();
    today.setDate(new Date().getDate() - 1);
    let startDate = today.toISOString().split('T')[0];
    let endDate = today.toISOString().split('T')[0];
    let url = `https://data.nasdaq.com/api/v3/datasets/BCHAIN/MKPRU?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();

    // console.log('API answers:', responseAsJson['dataset']['data'][0][1]);
    bitToday(responseAsJson);
}

function bitToday(responseAsJson) {
    let bitCoinToday = responseAsJson['dataset']['data'][0][1];
    document.getElementById('bitToday').innerHTML = bitCoinToday;
}