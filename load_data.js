/**
 * @author Sarvesh Kulkarni <sarveshsk43@gmail.com>
 */

var serverData, global_search = { 'year': [], 'launch': [], 'landing': [] },
    all_years = ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    URLSearchParams = new URLSearchParams("?foo=1&bar=2");
var stateObj = {};
console.log(URLSearchParams.toString());

function loadSpacExData() {
    bindClickEvents();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            serverData = JSON.parse(this.responseText);
            renderResults(serverData);
            readStoredURLParams();
        }
    };
    xhttp.open("GET", "https://api.spacexdata.com/v3/launches?limit=100&amp;", true);
    xhttp.send();
}

function renderResults(launchData) {
    console.log(launchData);
    var mission_card = '';
    for (let i = 0; i < launchData.length; i++) {
        let mission_patch = launchData[i].links.mission_patch;
        let mission_name = launchData[i].mission_name;
        let flight_number = launchData[i].flight_number;
        let mission_ids = launchData[i].mission_id.length > 0 ? launchData[i].mission_id.toString() : '';
        let launch_year = launchData[i].launch_year;
        let launch_success = launchData[i].launch_success;

        mission_card += `<div class = "launch-detail-card"><img src=${mission_patch} class = "launch-detail-card-img"/>
        <div class="satelite-title"> ${mission_name} #${flight_number}</div>
        <div class="strong-text">Mission Ids: <small class="value-color"> ${mission_ids} </small></div>
        <div class="strong-text">Launch Year: <small class="value-color"> ${launch_year} </small></div>
        <div class="strong-text"> Successfull Launch : <small class="value-color"> ${launch_success}</small></div>
        <div class="strong-text"> Successfull Landing : <small class="value-color"> ${launch_success}</small></div>
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
        (attribute_year) ? global_search['year'].push(attribute_year): '';
        URLSearchParams.append('year', attribute_year);
    } else if (attribute_type == "launch") {
        attribute_launch = this.classList.toggle('btn-dark') ? this.getAttribute("value") : removeFromSearch('launch', this.getAttribute("value"));
        (attribute_launch) ? global_search['launch'] = attribute_launch: null;
        URLSearchParams.append('launch', attribute_launch);
    } else if (attribute_type == "landing") {
        attribute_landing = this.classList.toggle('btn-dark') ? this.getAttribute("value") : removeFromSearch('landing', this.getAttribute("value"));
        (attribute_landing) ? global_search['landing'] = attribute_landing: null;
        URLSearchParams.append('launch', attribute_landing);
    }

    filterResults();
};

function removeFromSearch(key, value) {
    if (key == 'year') {
        let filtered_array = global_search[key].filter(function(e) { return e != value });
        global_search[key] = filtered_array;
    } else {
        global_search[key] = '';
    }
    URLSearchParams.delete(key);
    filterResults();
}

function filterResults() {

    launch_year = global_search['year'].length == 0 ? all_years : global_search['year'];
    launch_success = global_search['launch'];
    landing_success = global_search['landing'];
    (launch_success == 'true') ? launch_success_t = true: launch_success_t = '';
    (landing_success == 'true') ? landing_success_t = true: landing_success_t = '';
    (launch_success == 'false') ? launch_success_f = false: launch_success_f = '';
    (landing_success == 'false') ? landing_success_f = false: landing_success_f = '';

    console.log(launch_success_t, launch_success_f);

    renderResults(serverData.filter(
        function(entry) {
            return launch_year.includes((entry.launch_year).toString()) && (entry.launch_success == launch_success_t);
        }
    ))

}

function readStoredURLParams() {
    global_search['year'] = URLSearchParams.getAll('year');
    global_search['launch'] = URLSearchParams.getAll('launch');
    global_search['landing'] = URLSearchParams.getAll('landing');


    if (global_search['year'].length > 0 || global_search['launch'].length > 0 || global_search['landing'].length > 0) {
        filterResults();
    }

}