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
/*-------------------------------------------------------------------------------------------------------------------------*/


const API_KEY = '6zXQ5n3xF-ZKs-mHV_yZ';
let ID;
let url;
let startDate = '';
let endDate = '';
let valueMin;
let valueMax;
let valueAvg;
let bitCurrency;
const bitcoin = 0;
let bit = [];
let bit2 = [];
let labelsY = [];
let labelsX = [];
let labelsBarX = [];
let labelsBarY = [];
let responseAsJson;



/*function fetch() {
    var requestURL = 'https://api.exchangerate.host/latest';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        var response = request.response;
        console.log(response);
    }

}*/

/*async function loadBitValues() {
    let url2 = `https://data.nasdaq.com/api/v3/datasets/BITFINEX/BTCUSD?start_date=${startDate2}&end_date=${endDate2}&api_key=${API_KEY}`;
    let response2 = await fetch(url2);
    responseAsJson2 = await response2.json();
    bit2.push(responseAsJson2)
    bitToday(responseAsJson2);

    console.log(responseAsJson2);
}*/

async function loadBitCoin() {
    let url = `https://data.nasdaq.com/api/v3/datasets/BITFINEX/BTCUSD?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    //  let url = `https://data.nasdaq.com/api/v3/datasets/BCHAIN/MKPRU?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    let response = await fetch(url);
    responseAsJson = await response.json();
    bit.push(responseAsJson);
    bitToday(responseAsJson);

    console.log(responseAsJson);
}

function bitToday(responseAsJson) {
    let bitCoinToday = responseAsJson['dataset']['data'][0][1];
    let refresh = responseAsJson['dataset']['refreshed_at'].replace('T', ' at ').replace('Z', '').slice(0, -4);
    let available = responseAsJson['dataset']['oldest_available_date'];
    let newest = responseAsJson['dataset']['newest_available_date'];
    document.getElementById('bitToday').innerHTML = bitCoinToday.toLocaleString('en-US');
    bitCurrency = bitCoinToday;
    document.getElementById('refresh').innerHTML = refresh;
    document.getElementById('update').innerHTML = available;
    document.getElementById('newest').innerHTML = newest;
    document.getElementById('exchangeRate').innerHTML = bitCoinToday.toLocaleString('en-US');
    document.getElementById('exchangeDate').innerHTML = refresh;
    // document.getElementById('exchangeNewDate').innerHTML = newest;
    console.log(refresh);
}

function bitTable() {
    let tableData = document.getElementById('table');
    let responseData = responseAsJson.dataset.data;
    tableData.innerHTML = "";
    tableData.innerHTML += `
    <table class="table">
    <tbody>
    <tr>
    <th>Date</th>
    <th>Low</th>
    <th>Mid</th>
    <th>High</th>
    <th>Last</th>
    
    </tr> 
    </tbody>
    </table>
    `;
    for (let i = 0; i < responseData.length; i++) {
        tableData.innerHTML += `
        <table class="table">
            <tbody>
                <tr>
                <td>${responseData[i][0]}</td>
                <td>${responseData[i][2].toFixed(2)}</td>
                <td>${responseData[i][3].toFixed(2)}</td>
                <td>${responseData[i][1].toFixed(2)}</td>
                <td>${responseData[i][4].toFixed(2)}</td>
                    
                </tr>
            </tbody>
        </table>
        `;

    }

}

async function updateDate() {
    startDate = document.getElementById('startData').value;
    endDate = document.getElementById('endData').value;
    await loadBitCoin();
    chart();
    chartBar();
    bitTable();
    document.getElementById('canvas').classList.remove('d-none');
    //   document.getElementById('exchange').classList.remove('d-none');
    document.getElementById('canvas').scrollIntoView({
        behavior: 'smooth'
    });
}

function showChartOne() {
    document.getElementById('myChart').classList.remove('d-none');
    document.getElementById('myChartBar').classList.add('d-none');
    document.getElementById('table').classList.add('d-none');
}

function showChartTwo() {
    document.getElementById('myChart').classList.add('d-none');
    document.getElementById('myChartBar').classList.remove('d-none');
    document.getElementById('table').classList.add('d-none');
}

function showTable() {
    document.getElementById('myChart').classList.add('d-none');
    document.getElementById('myChartBar').classList.add('d-none');
    document.getElementById('table').classList.remove('d-none');

}



function chart() {
    setTimeout(() => {
        let array = responseAsJson.dataset.data.reverse();
        for (let i = 0; i < array.length; i++) {
            labelsY.push(array[i][0]);
            labelsX.push(array[i][1]);
            //  for (let i = array.length - 1; i > 0; i--) {
            // labelsY.push(array[i][0]);
            // labelsX.push(array[i][1]);



        }

        const data = {
            labels: labelsY,
            datasets: [{
                label: 'Bitcoin',
                backgroundColor: 'rgb(10,102,194)',
                borderColor: 'rgb(10, 102, 194)',
                data: labelsX,
            }]
        };


        const config = {
            type: 'line',
            data: data,
            options: {}
        };
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    }, 100);


}

function chartBar() {
    setTimeout(() => {
        let array = responseAsJson.dataset.data;
        for (let i = 0; i < array.length; i++) {
            labelsBarY.push(array[i][0]);
            labelsBarX.push(array[i][1]);
            // for (let i = array.length - 1; i > 0; i--) {
            //     labelsY.push(array[i][0]);
            //     labelsX.push(array[i][1]);



        }

        const data = {
            labels: labelsBarY,
            datasets: [{
                label: 'Bitcoin',
                backgroundColor: 'rgb(10,102,194)',
                borderColor: 'rgb(10, 102, 194)',
                data: labelsBarX,
            }]
        };


        const config = {
            type: 'bar',
            data: data,
            options: {}
        };
        const myChart = new Chart(
            document.getElementById('myChartBar'),
            config
        );
    }, 100);


}


function convertX() {
    let x = document.getElementById('curr_usd').value * bitCurrency;
    x = Math.round(x * 100) / 100;
    document.getElementById('curr_bitcoin').value = x.toLocaleString('en-US');
}

function convertY() {
    let y = document.getElementById('curr_usd').value / bitCurrency;
    document.getElementById('curr_bitcoin').value = y.toFixed(6).replace('.', ',');
}

function changeY() {
    let change = document.getElementById('changeConverter');
    change.innerHTML = '';
    change.innerHTML = `

<div class="currencyField">

<input oninput="convertY()" id="curr_usd" type="text" required>
<span>USD</span>
</div>
<img onclick="changeX()"class="exchangeImg" src="img/converter.png">
<div class="currencyField">

<input id="curr_bitcoin" type="text">
<span>BIT</span>
</div>


`;
}

function changeX() {
    let change = document.getElementById('changeConverter');
    change.innerHTML = '';
    change.innerHTML = `

<div class="currencyField">

<input oninput="convertX()" id="curr_usd" type="text" required>
<span>BIT</span>
</div>
<img onclick="changeY()"class="exchangeImg" src="img/converter.png">
<div class="currencyField">

<input id="curr_bitcoin" type="text">
<span>USD</span>
</div>


`;
}

function scrollToExchange() {
    document.getElementById('convertSection').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToHistory() {
    document.getElementById('history').scrollIntoView({
        behavior: 'smooth'
    });
}












/*
anychart.onDocumentReady(function() {

    // create a data set
    let data = anychart.data.set([

        ["January", 16000, 8000],
        ["February", 15000, 12000],
        ["March", 16000, 18000],
        ["April", 15000, 11000],
        ["May", 14000, 9000]



    ]);

    // map the data
    var seriesData_1 = data.mapAs({ x: 0, value: 1 });
    var seriesData_2 = data.mapAs({ x: 0, value: 2 });

    // create a chart
    var chart = anychart.area();

    // set the interactivity mode
    chart.interactivity().hoverMode("single");

    // create the first series, set the data and name
    var series1 = chart.area(seriesData_1);
    series1.name("2004");

    // configure the visual settings of the first series
    series1.normal().fill("#00cc99", 0.3);
    series1.hovered().fill("#00cc99", 0.1);
    series1.selected().fill("#00cc99", 0.5);
    series1.normal().stroke("#00cc99", 1, "10 5", "round");
    series1.hovered().stroke("#00cc99", 2, "10 5", "round");
    series1.selected().stroke("#00cc99", 4, "10 5", "round");

    // create the second series, set the data and name  
    var series2 = chart.area(seriesData_2);
    series2.name("2005");

    // configure the visual settings of the second series
    series2.normal().fill("#0066cc", 0.3);
    series2.hovered().fill("#0066cc", 0.1);
    series2.selected().fill("#0066cc", 0.5);
    series2.normal().hatchFill("forward-diagonal", "#0066cc", 1, 15);
    series2.hovered().hatchFill("forward-diagonal", "#0066cc", 1, 15);
    series2.selected().hatchFill("forward-diagonal", "#0066cc", 1, 15);
    series2.normal().stroke("#0066cc");
    series2.hovered().stroke("#0066cc", 2);
    series2.selected().stroke("#0066cc", 4);

    // set the chart title
    chart.title("Area Chart: Appearance");

    // set the titles of the axes
    chart.xAxis().title("Timeline");
    chart.yAxis().title("Value, $");

    // set the container id
    chart.container("container");

    // initiate drawing the chart
    chart.draw();
});

*/