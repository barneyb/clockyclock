import clock from "clock";
import document from "document";
import { dayName, monthName, zeroPad } from "../common/utils";

clock.granularity = "minutes";

const $date = document.getElementById("date")!;
const $time = document.getElementById("time")!;

function getDateString(d: Date) {
    return dayName(d.getDay()) + ", " + d.getDate() + " " + monthName(d.getMonth());
}

function getTimeString(d: Date) {
    const hours = d.getHours()
    return (hours === 0 ? 12 : hours <= 12 ? hours : hours % 12) + ":" + zeroPad(d.getMinutes());
}

clock.ontick = (evt) => {
    const now = evt.date;
    $date.text = getDateString(now);
    $time.text = getTimeString(now);
}
