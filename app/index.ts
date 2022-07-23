import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { battery } from "power";
import { dayHistory } from "user-activity";

if (appbit.permissions.granted("access_activity")) {
    const data = dayHistory.query({ limit: 14 })
        .map(it => it.steps)
        .filter(it => it)
    console.log(`${dayHistory.maxRecordCount}: ${data}`);
}

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel") as Element;
clock.ontick = (evt) => {
    const today = evt.date;
    let hours: number | string = today.getHours();
    if (preferences.clockDisplay === "12h") {
        // 12h format
        hours = hours % 12 || 12;
    } else {
        // 24h format
        hours = util.zeroPad(hours);
    }
    const mins = util.zeroPad(today.getMinutes());
    myLabel.text = `${hours}:${mins}`;
}

const batt = document.getElementById("batt") as TextElement;
battery.addEventListener("change", () => {
    batt.text = battery.chargeLevel < 25 && !battery.charging
        ? "plug in!"
        : "";
});

// display heartrate when the screen's on
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const hr = document.getElementById("hr") as TextElement;
    const hrm = new HeartRateSensor();
    hrm.addEventListener("reading", () => {
        hr.text = `${hrm.heartRate} bpm`;
    });
    display.addEventListener("change", () => {
        // Automatically stop the sensor when the screen is off to conserve battery
        display.on ? hrm.start() : hrm.stop();
    });
    hrm.start();
}
