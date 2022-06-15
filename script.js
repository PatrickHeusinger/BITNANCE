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
const bitcoin = 0;
let bit = [];
let responseAsJson;


async function loadBitCoin() {

    let url = `https://data.nasdaq.com/api/v3/datasets/BCHAIN/MKPRU?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    let response = await fetch(url);
    responseAsJson = await response.json();
    bit.push(responseAsJson)
    bitToday(responseAsJson);

    console.log(responseAsJson);
}

function bitToday(responseAsJson) {
    let bitCoinToday = responseAsJson['dataset']['data'][0][1];
    let refresh = responseAsJson['dataset']['refreshed_at'].replace('T', ', ');
    document.getElementById('bitToday').innerHTML = bitCoinToday;
    document.getElementById('refresh').innerHTML = refresh;

    console.log(refresh);
}

function bitTable() {
    let tableData = document.getElementById('table');
    let responseData = responseAsJson.dataset.data;
    tableData.innerHTML = "";
    tableData.innerHTML += `
    <table>
    <tbody>
    <tr>
    <th>Price</th>
    <th>Date</th>
    </tr> 
    </tbody>
    </table>
    `;
    for (let i = 0; i < responseData.length; i++) {

        tableData.innerHTML += `
        <table>
            <tbody>
                <tr>
                    <td>${responseData[i][1].toFixed(2)}&nbsp<b>USD</b></td>
                    <td>${responseData[i][0]}</td>
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
    bitTable();

    document.getElementById('table').scrollIntoView({
        behavior: 'smooth'
    });
}

let labelsY = [];
let labelsX = [];

function chart() {
    setTimeout(() => {
        let array = responseAsJson.dataset.data;
        for (let i = 0; i < array.length; i++) {
            labelsY.push(array[i][0]);
            labelsX.push(array[i][1]);

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