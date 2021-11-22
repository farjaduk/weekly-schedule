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

setCurrentDateAndHour(); // Set todaysDate, currentDateString, and currentHour, display date in header
buildTimeBlocks(); // Build rest of html for page
getTimeEntries(); // See if there are entries in localstorage and load them

$(".saveBtn").click(saveClick); // Set event handler for all save buttons


// Done when page loads; sets date in header and determines current hour
function setTodaysDateAndHour() {
    var today = new Date(); // gets current date
    var day = today.getDate();
    var dayEnd = "th"; // 1st, 2nd, 3rd, 4th, etc.

    currentHour = today.getHours(); // current hour, in military format

    // pad with zero if day is less than 10 for sorting purposes
    if (day < 10) {
        todaysDate = today.getFullYear() + months[today.getMonth()] + "0" + day; 
    }
    else {
        todaysDate = today.getFullYear() + months[today.getMonth()] + day;
    }

    // Add correct ending to day; default to initialized value of "th"
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
        day + dayEnd + ", " + today.getFullYear(); // date string to display in header
    $("#currentDay").text(todaysDateString); // set header date
}