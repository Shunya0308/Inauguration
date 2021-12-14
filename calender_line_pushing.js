function setTrigger(){
    const date = new Date()
    date.setDate(date.getDate() + 1)
    date.setHours(06);
    date.setMinutes(30);
    ScriptApp.newTrigger('main').timeBased().at(date).create();
}

function getCalendars(){
    return CalendarApp.getAllCalendars()
}

function formatJST(date){
    return Utilities.formatDate(date, 'JST', 'HH:mm');
}

function getSchedules(calendars, date){
    schedules = [];

    calendars.forEach(function(cal) {
    const events = cal.getEventsForDay(date);
    if (events.length < 1) {return}

    events.forEach(function(event){
        schedules.push({
        title: event.getTitle(),
        startTime: formatJST(event.getStartTime()),
        endTime: formatJST(event.getEndTime())
        })
    })
})

    return schedules;
}

function createMessage(schedules){
    messages = "\n";

    if (schedules.length < 1) {
    messages += "今日の予定はありません。"
    } else {
    schedules.forEach(function(schedule){
        messages += "●" + schedule.title + " " + schedule.startTime + "~" + schedule.endTime + "\n";
    })
}

    return messages
}

function sendToLine(messages){
    const token = "xxxxxxxxxxxx";
    const options =
    {
        "method"  : "post",
        "headers" : {"Authorization" : "Bearer "+ token},
        "payload" : "message=" + messages

    };

    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}

function main() {
    setTrigger();
    const calendar = getCalendars();
    const todaysSchedules = getSchedules(calendar, new Date());
    const messages = createMessage(todaysSchedules);
    sendToLine(messages);
}