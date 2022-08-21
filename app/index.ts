import clock from "clock";
import document from "document";
import { getDateString, getTimeString, intString } from "../common/utils";
import { me as appbit } from "appbit";
import { today } from "user-activity"
import { display } from "display";

clock.granularity = "minutes";

const $date = document.getElementById("date")!;
const $time = document.getElementById("time")!;
clock.ontick = (e) => {
    const now = e.date;
    $date.text = getDateString(now);
    $time.text = getTimeString(now);
}

const $steps = document.getElementById("steps")!;
const $floors = document.getElementById("floors")!;
display.onchange = (e) => {
    if (!display.on) return;
    let steps = "-", floors = "-";
    if (appbit.permissions.granted("access_activity")) {
        steps = intString(today.adjusted.steps);
        floors = intString(today.adjusted.elevationGain);
    }
    $steps.text = steps;
    $floors.text = floors;
};
