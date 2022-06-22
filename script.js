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
let bitCurrency = 0;
let myChart = null;
let myChartBar = null;
let currentDay;
let bit = [];
let labelsY = [];
let labelsX = [];
let labelsBarX = [];
let labelsBarY = [];
let responseAsJson;


async function loadBitCoin() {
    let url = `https://data.nasdaq.com/api/v3/datasets/BITFINEX/BTCUSD?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    //let url = `https://data.nasdaq.com/api/v3/datasets/BCHAIN/MKPRU?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    let response = await fetch(url);
    responseAsJson = await response.json();
    bit.push(responseAsJson);
    bitToday(responseAsJson);

}

function bitToday(responseAsJson) {
    let bitCoinToday = responseAsJson['dataset']['data'][0][1];
    let refresh = responseAsJson['dataset']['refreshed_at'].replace('T', ', ').replace('Z', '').slice(0, -4);
    let available = responseAsJson['dataset']['oldest_available_date'];
    let newest = responseAsJson['dataset']['newest_available_date'];
    currentDay = newest
    document.getElementById('refresh').innerHTML = refresh;
    document.getElementById('update').innerHTML = available;
    document.getElementById('newest').innerHTML = newest;
    document.getElementById('exchangeDate').innerHTML = refresh;
    saveBitToday(bitCoinToday);
}

function saveBitToday(bitCoinToday) {
    if (bitCurrency == 0) {
        bitCurrency = bitCoinToday;
        document.getElementById('bitToday').innerHTML = bitCoinToday.toLocaleString('en-US');
        document.getElementById('exchangeRate').innerHTML = bitCoinToday.toLocaleString('en-US');
    }
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
    loading();
    startDate = document.getElementById('startData').value;
    endDate = document.getElementById('endData').value;
    await loadBitCoin();
    chart();
    chartBar();
    bitTable();
    loadingComplete();
    document.getElementById('canvas').classList.remove('d-none');
    document.getElementById('canvas').scrollIntoView({
        behavior: 'smooth'
    });
}

function loading() {
    document.getElementById('progress').classList.remove('d-none');
}

function loadingComplete() {
    document.getElementById('progress').classList.add('d-none');
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
    if (myChart != null) {
        myChart.destroy();
        labelsX = [];
        labelsY = [];

    };
    setTimeout(() => {
        let array = responseAsJson.dataset.data.reverse();
        for (let i = 0; i < array.length; i++) {
            labelsY.push(array[i][0]);
            labelsX.push(array[i][1]);

        }

        const data = {
            labels: labelsY,
            datasets: [{
                label: 'Bitcoin',
                backgroundColor: 'rgb(4,19,105)',
                borderColor: 'rgb(4,19,105)',
                data: labelsX,
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: 'rgb(4,19,105)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgb(4,19,105)'
                        }
                    }
                }
            }
        };

        myChart = new Chart(
            document.getElementById('myChart'),
            config
        );


    }, 100);
}


function chartBar() {
    if (myChartBar != null) {
        myChartBar.destroy();
        labelsBarX = [];
        labelsBarY = [];
    };

    setTimeout(() => {
        let array = responseAsJson.dataset.data;
        for (let i = 0; i < array.length; i++) {
            labelsBarY.push(array[i][0]);
            labelsBarX.push(array[i][1]);
        }

        const data = {
            labels: labelsBarY,
            datasets: [{
                label: 'Bitcoin',
                backgroundColor: 'rgb(4,19,105)',
                borderColor: 'rgb(4,19,105)',
                data: labelsBarX,
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: 'rgb(4,19,105)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgb(4,19,105)'
                        }
                    }
                }
            }
        };

        myChartBar = new Chart(
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

function disabledAlert() {
    let alert = document.getElementById('alert');
    alert.innerHTML = '';
    alert.innerHTML = 'Choose start and end date please !';
    setTimeout(() => {
        alert.innerHTML = '';
    }, 2000);
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

/*---------------------------set-datepicker---------------------------*/

$(function() {
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate() - 1;
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();

    var minDate = year + '-' + month + '-' + day;

    $('#endData').attr('max', minDate);
    $('#startData').attr('max', minDate);

});
setTimeout(() => {
    const picker = document.getElementById('endData');
    picker.addEventListener('change', checkDatePicker);

}, 2000);


function checkDatePicker() {
    if ($('#startData').val() != "" && $('#endData').val() != "") {
        $('#submit').removeAttr('disabled');
        document.getElementById('shield').classList.remove('alertButton');
    } else {
        $('#submit').attr('disabled', true);
    }
}