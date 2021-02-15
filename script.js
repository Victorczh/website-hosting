const host = "http://localhost:8080";
var numberOfQueues = 0;
var numberOfForms = 0;

function addQueue() {
    numberOfQueues++;
    if (numberOfQueues > 1) {
        numberOfForms++;
        // Remove Button to Add Next Queue Tab
        var addQueueButton = document.getElementById("AddQueueButtonContainer");
        addQueueButton.remove();

        // Add New Queue Tab
        $('#QueueRow').append(`
        <form class="col-md-6 mb-3 needs-validation" id="`+ numberOfForms + `" novalidate>
    <div id="form">
        <button id="closeButton`+ numberOfForms + `" class="closeButton" ><i class="material-icons">close</i></button>

        <div class="form-group row d-flex justify-content-around  pl-4 pr-4 pt-5 pb-1">
            <label for="inputCompanyId" class="col-sm-2.2 col-form-label text-white pl-3 pt-2" id="companyId">Company
                Id</label>
            <div class="col-sm-6 mt-1 w-100 pl-1" id="searchField">
                <div class="input-group md-form form-sm form-1">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="searchIcon"><i class="fas fa-search"
                                aria-hidden="true"></i></span>
                    </div>
                    <input class="form-control" type="number" placeholder="Search" aria-label="Search"
                        id="inputCompanyId" required>
                </div>
            </div>
            <button class="col-sm-2 pr-0 pl-0" type="submit" id="searchButton">Search
            </button>
            <div class="loader`+ numberOfForms + `" id="loader"></div>
        </div>
        <p class="text-center text-danger mr-5 mb-4" id="validationError`+ numberOfForms + `"></p>
        <div class="form-group row d-flex justify-content-around pl-5 pr-4 pb-2">
            <label class="col-sm-2.3 col-form-label text-white ml-4" id="queueId">Queue Id</label>
            <select class="col-sm-5 dropdown ml-0 rounded" id="select`+ numberOfForms + `">
            </select>
            <div class="form-check mt-2 mr-6">
                <input type="checkbox" class="form-check-input mt-2" id="checkBox`+ numberOfForms + `" checked>
                <label class="form-check-label mr-5" for="exampleCheck1" id="checkboxText">Hide
                    Inactive</label>
            </div>
        </div>
        <div class="row">
        <div class="loader2`+ numberOfForms + `" id="loader2"></div>
        <div class="form-group row d-flex justify-content-around pl-4 pr-4 pb-2">
            <div id="chartDiv`+ numberOfForms + `"></div>
        </div>
        </div>
    </div>
    </div>
</form>`);
        // Add Back button to the end of the new Queue Tab
        $('#QueueRow').append(`<div class="col-md-6 mb-5" id="AddQueueButtonContainer">
        <button type="button" class="btn btn-lg btn-block text-white" id="addQueueButton"
            onclick="addQueue()">
            <i class="material-icons align-text-bottom text-white">add_circle_outline</i>Add
            another</button>
    </div>`);
    } else {
        // If its the first Queue Tab, Add a new Queue Tab before the button 
        $('#QueueRow').prepend(`
        <form class="col-md-6 mb-3 needs-validation" id="`+ numberOfForms + `" novalidate>
    <div id="form">
        <button id="closeButton`+ numberOfForms + `" class="closeButton" ><i class="material-icons">close</i></button>
        <div class="form-group row d-flex justify-content-around  pl-4 pr-4 pt-5 pb-1">
            <label for="inputCompanyId" class="col-sm-2.2 col-form-label text-white pl-3 pt-2" id="companyId">Company
                Id</label>
            <div class="col-sm-6 mt-1 w-100 pl-1" id="searchField">
                <div class="input-group md-form form-sm form-1">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="searchIcon"><i class="fas fa-search"
                                aria-hidden="true"></i></span>
                    </div>
                    <input class="form-control" type="number" placeholder="Search" aria-label="Search"
                        id="inputCompanyId" required>
                </div>
            </div>
            <button class="col-sm-2 pr-0 pl-0" type="submit" id="searchButton">Search
            </button>
            <div class="loader`+ numberOfForms + `" id="loader"></div>
        </div>
        <p class="text-center text-danger mr-5 mb-4" id="validationError`+ numberOfForms + `"></p>
        <div class="form-group row d-flex justify-content-around pl-5 pr-4 pb-2">
            <label class="col-sm-2.3 col-form-label text-white ml-4" id="queueId">Queue Id</label>
            <select class="col-sm-5 dropdown ml-0 rounded" id="select`+ numberOfForms + `">
            </select>
            <div class="form-check mt-2 mr-6" id="checkBox">
                <input type="checkbox" class="form-check-input mt-2" id="checkBox`+ numberOfForms + `" checked>
                <label class="form-check-label mr-5" for="exampleCheck1" id="checkboxText">Hide
                    Inactive</label>
            </div>
        </div>
        <div class="row">
        <div class="loader2`+ numberOfForms + `" id="loader2"></div>
        <div class="form-group row d-flex justify-content-around pl-4 pr-4 pb-2">
            <div id="chartDiv`+ numberOfForms + `"></div>
        </div>
        </div>
    </div>
    </div>
</form>`);
    }
    addEvents(numberOfForms);
}

function addEvents(formId) {
    // addEventListener for the element with NumberOfForms
    // if NumberOfForms is 0, find the element with NumberOfForms as the Id
    document.getElementById(formId).addEventListener("submit", function (ev) {
        ev.preventDefault();
        clearForm(this, this.id);
        closeGraph(this.id);
        if (validateInput(this, this.id)) {
            searchCompany(this, this.id);
        }
    });
    document.getElementById("closeButton" + formId).addEventListener("click", function (ev) {
        removeForm(formId);
    });
}

function searchCompany(form, formId) {
    var text = document.getElementById("validationError" + formId);
    var formElement = document.getElementById(formId);
    var loader = formElement.getElementsByClassName("loader" + formId)[0];
    var companyId = form.elements["inputCompanyId"].value;
    loader.style.visibility = "visible";
    jQuery.ajax({
        method: "GET",
        url: `${host}/company/queue?company_id=${companyId}`
    }).done(function (data) {
        loader.style.visibility = "hidden";
        populateSelect(data, form, formId);
        if (data.length == 0) {
            text.innerHTML = "Unknown Company Id";
        }
    }).fail(function (data, status, xhr) {
        text.innerHTML = "Unable to connect to backend!";
        loader.style.visibility = "hidden";
    });
}

function removeForm(formId) {
    var form = document.getElementById(formId);
    closeGraph(formId);
    form.remove();
};

function populateSelect(data, form, formId) {
    var queueArray = data;
    var element = form.elements["select" + formId];
    element.innerHTML = element.innerHTML + '<option value=" " id="defaultValue" disabled selected>' + "Select Queue Id" + '</option>';
    for (var i = 0; i < queueArray.length; i++) {
        if (queueArray[i].is_active == 1) {
            element.innerHTML = element.innerHTML + '<option value="' + queueArray[i].queue_id + '">' + queueArray[i].queue_id + '</option>';
        } else if (queueArray[i].is_active == 0) {
            element.innerHTML = element.innerHTML + '<option value="' + queueArray[i].queue_id + '" class="inactiveQueue' + formId + '">' + queueArray[i].queue_id + '[X]' + '</option>';
        }
    }
    document.getElementById("checkBox" + formId).addEventListener('change', (event) => {
        checkIsActive(formId);
    });
    document.getElementById("select" + formId).addEventListener("change", function () {
        let currentQueue = this.parentElement.parentElement.parentElement.id;
        let selectedOption = this.options[this.selectedIndex].value;
        graphChange(currentQueue, selectedOption);
    });
    checkIsActive(formId);
}

function checkIsActive(formId) {
    var checkBox = document.getElementById("checkBox" + formId);
    if (checkBox.checked == true) {
        $(".inactiveQueue" + formId).css("visibility", "hidden");
        $(".inactiveQueue" + formId).css("display", "none");

    }
    else if (checkBox.checked == false) {
        $(".inactiveQueue" + formId).css("visibility", "visible");
        $(".inactiveQueue" + formId).css("display", "block");
    }
}

//remove pervious options
function clearForm(form, formId) {
    document.getElementById("validationError" + formId).innerHTML = "";
    var select = form.elements["select" + formId];
    var length = select.options.length;
    for (i = length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
    closeGraph(formId);
}

function validateInput(form, formId) {
    var input, text;
    // Get the value of the input field with id
    input = form.elements["inputCompanyId"].value;
    text = document.getElementById("validationError" + formId);

    // If x is Not a Number or less than one or greater than 10
    if (isNaN(input) || input.length == 0) {
        text.innerHTML = "A valid Company Id is required!";
    }
    else if (input < 1000000000) {
        text.innerHTML = "Company Id less than 10 digits";
    }
    else if (input > 9999999999) {
        text.innerHTML = "Company Id more than 10 digits";
    } else {
        return true;
    }
    return false;
}

// Graph Logic    
var queue = [];
var repeat = [];

// Load the Visualization API and the piechart package.
google.charts.load("current", { "packages": ["corechart", "line"] });

function drawChart(chartId, selectedOption) {
    let formElement = document.getElementById(chartId);
    let loader2 = formElement.getElementsByClassName("loader2" + chartId)[0];
    loader2.style.visibility = "visible";
    var time = new Date().getTime();
    time = time - (60000 * 3);
    var timeNow = new Date(time);
    timeNow.setHours(timeNow.getHours() + 8);
    var timestamp = timeNow.toISOString().slice(0, 19);
    var jsonData = $.ajax({
        url: `http://localhost:8080/company/arrival_rate?queue_id=${selectedOption}&from=${timestamp}%2B08:00&duration=3`,
        dataType: "json",
    }).done(function (jsonData) {
        // Create our data table out of JSON data loaded from server.
        var data = new google.visualization.DataTable();
        // when data is all 0 start at 0
        let zeroData = true;
        // max number for graph
        let highestNumber = 0;
        data.addColumn("datetime", "timestamp");
        data.addColumn("number", "count");
        for (i = 0; i < jsonData.length; i++) {
            if (Number(jsonData[i].count) != 0) {
                zeroData = false;
            }
            if (Number(jsonData[i].count) > highestNumber) {
                highestNumber = Number(jsonData[i].count);
            }
            data.addRows([
                [new Date(time + (i * 1000)), Number(jsonData[i].count)],
            ])
        }
        var options = "";
        // if data is all zero(flat line) send this options
        if (zeroData == true) {
            options = {
                title: "Arrival Rate",
                vAxis: {
                    viewWindow: {
                        min: 0,
                        max: highestNumber + 10
                    },
                    minValue: 0,
                },
                hAxis: {},
                width: 400,
                height: 240,
            }
        }
        else {
            options = {
                title: "Arrival Rate",
                vAxis: {
                    viewWindow: {
                        min: 0,
                        max: highestNumber + 5
                    },
                    minValue: 0,
                },
                hAxis: {},
                width: 400,
                height: 240,
            }
        }
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById("chartDiv" + chartId));
        loader2.style.visibility = "hidden";
        chart.draw(data, options);
    });
}

function closeChart(chartId) {
    let chartRemove = new google.visualization.LineChart(document.getElementById("chartDiv" + chartId));
    chartRemove.clearChart();
}

function graphChange(formId, option) {
    if (queue[formId] != 1) {
        drawChart(formId, option);
        repeat[formId] = setInterval(drawChart, 3000, formId, option);
        queue[formId] = 1;
    }
    else {
        closeGraph(formId);
        drawChart(formId, option);
        repeat[formId] = setInterval(drawChart, 3000, formId, option);
        queue[formId] = 1;
    }
}
function closeGraph(formId) {
    document.getElementById("chartDiv" + formId).innerHTML = "";
    clearInterval(repeat[formId]);
    repeat[formId] = "";
    queue[formId] = "";
}

