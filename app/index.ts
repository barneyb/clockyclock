import clock from "clock";
import document from "document";
import { getDateString, getTimeString, intString } from "../common/utils";
import { me as appbit } from "appbit";
import { goals, today } from "user-activity"
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { goalLine, hide, hideParent, show } from "./elements";
import sleep from "sleep";

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
const $stepsLine = document.getElementById("steps-line") as GroupElement;
const $floorsLine = document.getElementById("floors-line") as GroupElement;
const updateActivity = () => {
    if (!display.on) return;
    const steps = today.adjusted.steps!;
    $steps.text = intString(steps);
    const stepFactor = steps / goals.steps!;
    const floors = today.adjusted.elevationGain!;
    $floors.text = intString(floors);
    const floorFactor = floors / goals.elevationGain!;
    if (stepFactor >= floorFactor) {
        goalLine($stepsLine, 60, stepFactor);
        goalLine($floorsLine, 20, floorFactor);
    } else {
        goalLine($stepsLine, 20, stepFactor);
        goalLine($floorsLine, 60, floorFactor);
    }
    updateSleep();
};

const $sleepIcon = document.getElementById("sleep-icon")!;
const updateSleep = () => {
    if (sleep!.state === "asleep") {
        hide($stepsLine)
        hide($floorsLine)
        show($sleepIcon)
    } else {
        show($stepsLine)
        show($floorsLine)
        hide($sleepIcon)
    }
};
if (appbit.permissions.granted("access_activity")) {
    display.addEventListener("change", updateActivity);
    updateActivity();
} else {
    hideParent($steps);
    hideParent($floors);
}

const $hr = document.getElementById("hr") as TextElement;
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const hrm = new HeartRateSensor({ frequency: 2, });
    hrm.addEventListener("reading", () => {
        if (!display.on) return;
        return $hr.text = intString(hrm.heartRate);
    });
    const updateHeartRate = () =>
        display.on
            ? hrm.start()
            : hrm.stop();
    display.addEventListener("change", updateHeartRate);
    updateHeartRate();
} else {
    hideParent($hr);
}

if (sleep && appbit.permissions.granted("access_sleep")) {
    sleep.addEventListener("change", updateSleep);
    updateSleep();
} else {
    console.warn("Sleep API not supported on this device, or no permission")
    hide($sleepIcon)
}
