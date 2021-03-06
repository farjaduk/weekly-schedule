var todaysDate = ""; // string for holding date index to timeEntries
var todaysDateString = ""; // string for holding today's date
var currentHour = 9; // current hour for highlighting the correct row (default to first hour)
var timeEntries = []; // starts list of log entries

const timeEntriesName = "ScheduleList"; // localstorage name
const firstEntry = 9; // first block at 9 am
const lastEntry = 17; // last block at 5pm 
const hourMap = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM",
                "1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"]; // map of military hours

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"];

setTodaysDateAndHour(); // Set todaysDate, todaysDateString, and currentHour, display date in header
TimeBlocks(); // Build time blocks on rest of page
getTimeEntries(); // Check for entries in localstorage and load them

$(".saveBtn").click(saveClick); // Set event handler for all save buttons


// Shows up Date ontop of screen when websites loaded
function setTodaysDateAndHour() {
    var today = new Date(); // gets todays date
    var day = today.getDate();
    var dayEnd = "th"; 

    currentHour = today.getHours(); // current hour, in military format

    // pad with zero if day is less than 10 for sorting purposes
    if (day < 10) {
        todaysDate = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        todaysDate = today.getFullYear() + months[today.getMonth()] + day;
    }

    // Add correct ending to day; default is "th"
    if ((day === 1) || (day === 21) || (day === 31)) {
        dayEnd = "st";
    }
    else if ((day === 2) || (day === 22)) {
        dayEnd = "nd";
    }
    else if ((day === 3) || (day === 23)) {
        dayEnd = "rd";
    }

    todaysDateString = days[today.getDay()] + ", " + months[today.getMonth()] + " " + 
        day + dayEnd + ", " + today.getFullYear(); 
    $("#currentDay").text(todaysDateString); 
}


// Creates time blocks
function TimeBlocks() {
    var containerDiv = $(".container"); // get the container div to append new rows to

    // Loop through hourMap, from [firstEntry] of "9AM" to [lastEntry] of "5PM"
    for (let hourBlock=firstEntry; hourBlock <= lastEntry; hourBlock++) {
        // build the html for the row and the first column
        var newHtml = '<div class="row time-block"> ' +
            '<div class="col-md-1 hour">' + hourMap[hourBlock] + '</div> ';
        
        // conditionally set second column to corrent class: past, present or future
        if (hourBlock < currentHour) {
            newHtml = newHtml + '<textarea class="col-md-10 description past" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        }
        else if (hourBlock === currentHour) {
            newHtml = newHtml + '<textarea class="col-md-10 description present" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        }
        else {
            newHtml = newHtml + '<textarea class="col-md-10 description future" id="text' + 
                hourMap[hourBlock] + '"></textarea> ';
        };

        // add last column and close the row div
        newHtml = newHtml + '<button class="btn saveBtn col-md-1" value="' + hourMap[hourBlock] + '">' +
            '<i class="fas fa-save"></i></button> ' +
            '</div>';

        // add new elements to container
        containerDiv.append(newHtml);
    }
}


// loads timeEntries array from localstorage
function getTimeEntries() {
    var teList = JSON.parse(localStorage.getItem(timeEntriesName));

    if (teList) {
        timeEntries = teList;
    }

    for (let i=0; i<timeEntries.length; i++) {
        // only load entries for today
        if (timeEntries[i].day == currentDate) {
            $("#text"+timeEntries[i].time).val(timeEntries[i].text); // update text in correct hour
        }
    }
}

// onClick event for all buttons
function saveClick() {
    var hourBlock = $(this).val(); 
    var entryFound = false;
    var newEntryIndex = timeEntries.length; // where in the timeEntries array the new object goes
    var newEntry = {day: currentDate, time: hourBlock, text: $("#text"+hourBlock).val()}; 

    // Time Comparison
    function timeGreater(time1,time2) {
        var num1 = parseInt(time1.substring(0, time1.length-2)); // numeric part of time1
        var num2 = parseInt(time2.substring(0, time2.length-2)); // numeric part of time2
        var per1 = time1.substr(-2,2); // AM/PM period for time1
        var per2 = time2.substr(-2,2); // AM/PM period for time2

        // Coverts 12 noon to zero for comparison below to work
        if (num1 === 12) {
            num1 = 0;
        }

        if (num2 === 12) {
            num2 = 0;
        }

        // first checks period than numeric of time
        if (per1 < per2) {
            return false; // AM < PM
        }
        else if (per1 > per2) {
            return true; // PM > AM
        }
        else {
            return (num1 > num2);
        }
    }

    // check the timeEntries array to see if there is already an entry for this hour
    for (let i=0; i<timeEntries.length; i++) {
        if (timeEntries[i].day == todaysDate) {
            if (timeEntries[i].time == hourBlock) {
                timeEntries[i].text = newEntry.text; // If entry already exists, just update text
                entryFound = true; // entry already exists
                break;
            }
            // entry does not exist - insert it when you reach the first hour that is greter
            else if (timeGreater(timeEntries[i].time, hourBlock)) {
                newEntryIndex = i;
                break;
            }
        }
        // no entries exist for todays day
        else if (timeEntries[i].day > todaysDate) {
            newEntryIndex = i;
            break;
        }
    }

    // if entry doesn't exist, add it to the array
    if (!entryFound) {
        timeEntries.splice(newEntryIndex, 0, newEntry);
    }


    localStorage.setItem(timeEntriesName, JSON.stringify(timeEntries));
}
