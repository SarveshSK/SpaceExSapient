/**
 * @author Sarvesh Kulkarni <sarveshsk43@gmail.com>
 */

var serverData, global_search = { 'year': '', 'launch': '', 'landing': '' },
    URLSearchParams = new URLSearchParams("?foo=1&bar=2");
var stateObj = {};

function loadSpacExData() {
    bindClickEvents();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            serverData = JSON.parse(this.responseText);
            renderResults(serverData);
            //readStoredURLParams();
        }
    };
    xhttp.open("GET", "https://api.spacexdata.com/v3/launches?limit=100&amp;", true);
    xhttp.send();
}

function renderResults(launchData) {
    var mission_card = '';
    for (let i = 0; i < launchData.length; i++) {
        let mission_patch = launchData[i].links.mission_patch;
        let mission_name = launchData[i].mission_name;
        let flight_number = launchData[i].flight_number;
        let mission_ids = launchData[i].mission_id.length > 0 ? launchData[i].mission_id.toString() : '';
        let launch_year = launchData[i].launch_year;
        let launch_success = launchData[i].launch_success;
        let landing_success = launchData[i].rocket.first_stage.cores[0].land_success;

        mission_card += `<li class="cards_item">
        <div class="card">
        <div class = "launch-detail-card">
        <img src=${mission_patch} class = "launch-detail-card-img"/>
        </div>
        <div class="satelite-title"> ${mission_name} #${flight_number}</div>
        <div>&nbsp;</div>
        <div class="strong-text">Mission Ids: <small class="value-color"> ${mission_ids} </small></div>
        <div class="strong-text">Launch Year: <small class="value-color"> ${launch_year} </small></div>
        <div class="strong-text"> Successfull Launch : <small class="value-color"> ${launch_success}</small></div>
        <div class="strong-text"> Successfull Landing : <small class="value-color"> ${landing_success}</small></div>
        </div>
        </li>
        
        </div>`;
    }
    document.getElementById("right-section").innerHTML = mission_card;
}

function bindClickEvents() {
    var elements = document.getElementsByClassName("btn-light");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', getSearchParams, false);
    }
}

function getSearchParams() {
    const stateObj = {};
    let attribute_year, attribute_launch, attribute_landing
    let attribute_type = this.getAttribute("search-type");
    if (attribute_type == "year") {
        attribute_year = this.classList.toggle('btn-dark') ? this.getAttribute("value") : removeFromSearch('year', this.getAttribute("value"));
        document.querySelectorAll('.btn-year').forEach(button => {
            if (button.value !== this.getAttribute("value")) {
                button.classList.remove('btn-dark');
            }
        });
        (attribute_year) ? global_search['year'] = attribute_year: global_search['year'] = '';
        URLSearchParams.append('year', attribute_year);
    } else if (attribute_type == "launch") {
        attribute_launch = this.classList.toggle('btn-dark') ? this.getAttribute("value") : removeFromSearch('launch', this.getAttribute("value"));
        (attribute_launch) ? global_search['launch'] = attribute_launch: global_search['launch'] = '';

        document.querySelectorAll('.btn-launch').forEach(button => {
            if (button.value !== this.getAttribute("value")) {
                button.classList.remove('btn-dark');
            }
        });
        URLSearchParams.append('launch', attribute_launch);
    } else if (attribute_type == "landing") {
        attribute_landing = this.classList.toggle('btn-dark') ? this.getAttribute("value") : removeFromSearch('landing', this.getAttribute("value"));
        (attribute_landing) ? global_search['landing'] = attribute_landing: global_search['landing'] = '';
        document.querySelectorAll('.btn-landing').forEach(button => {
            if (button.value !== this.getAttribute("value")) {
                button.classList.remove('btn-dark');
            }
        });
        URLSearchParams.append('launch', attribute_landing);
    }

    filterResults();
};

function removeFromSearch(key, value) {
    URLSearchParams.delete(key);
    // filterResults();
}

function filterResults() {

    launch_year = global_search['year'];
    launch_success = global_search['launch'];
    landing_success = global_search['landing'] == "false" ? null : true;

    if (global_search['year'] != '' && global_search['launch'] != '' && global_search['landing'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return launch_year == (entry.launch_year).toString() && launch_success == entry.launch_success.toString() && landing_success == entry.rocket.first_stage.cores[0].land_success;
            }))

    } else if (global_search['launch'] != '' && global_search['landing'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return launch_success == entry.launch_success.toString() && landing_success == entry.rocket.first_stage.cores[0].land_success;
            }))

    } else if (global_search['launch'] != '' && global_search['year'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return launch_year == (entry.launch_year).toString() && launch_success == entry.launch_success.toString();
            }))

    } else if (global_search['landing'] != '' && global_search['year'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return launch_year == (entry.launch_year).toString() && landing_success == entry.rocket.first_stage.cores[0].land_success;
            }))

    } else if (global_search['launch'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return launch_success == entry.launch_success.toString();
            }))

    } else if (global_search['landing'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return landing_success == entry.rocket.first_stage.cores[0].land_success;
            }))

    } else if (global_search['year'] != '') {
        renderResults(serverData.filter(
            function(entry) {
                return launch_year == (entry.launch_year).toString();
            }))

    } else {
        renderResults(serverData);

    }
}

function readStoredURLParams() {
    global_search['year'] = URLSearchParams.getAll('year');
    global_search['launch'] = URLSearchParams.getAll('launch');
    global_search['landing'] = URLSearchParams.getAll('landing');


    if (global_search['year'].length > 0 || global_search['launch'].length > 0 || global_search['landing'].length > 0) {
        filterResults();
    }

}