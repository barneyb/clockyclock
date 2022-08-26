import clock from "clock";
import document from "document";
import { getDateString, getTimeString, intString } from "../common/utils";
import { me as appbit } from "appbit";
import { goals, today } from "user-activity"
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { goalLine, hideParent } from "./elements";

clock.granularity = "minutes";

const $date = document.getElementById("date")!;
const $time = document.getElementById("time")!;
clock.ontick = (e) => {
    const now = e.date;
    $date.text = getDateString(now);
    $time.text = getTimeString(now);
}

const $steps = document.getElementById("steps") as TextElement;
const $floors = document.getElementById("floors") as TextElement;
if (appbit.permissions.granted("access_activity")) {
    const $stepsLine = document.getElementById("steps-line") as GroupElement;
    const $floorsLine = document.getElementById("floors-line") as GroupElement;
    const updateActivity = () => {
        if (!display.on) return;
        $steps.text = intString(today.adjusted.steps);
        $floors.text = intString(today.adjusted.elevationGain);
        goalLine($stepsLine, today.adjusted.steps!, goals.steps!)
        goalLine($floorsLine, today.adjusted.elevationGain!, goals.elevationGain!)
    };
    display.addEventListener("change", updateActivity);
    if (display.on) updateActivity();
} else {
    hideParent($steps);
    hideParent($floors);
}

const $sleep = document.getElementById("sleep") as TextElement;
hideParent($sleep); // todo: get this from the companion

const $hr = document.getElementById("hr") as TextElement;
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const hrm = new HeartRateSensor({ frequency: 2, });
    hrm.addEventListener("reading", () =>
        $hr.text = intString(hrm.heartRate));
    display.addEventListener("change", () =>
        display.on
            ? hrm.start()
            : hrm.stop());
    if (display.on) hrm.start();
} else {
    hideParent($hr);
}
