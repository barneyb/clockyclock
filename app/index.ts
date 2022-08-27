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
        const steps = today.adjusted.steps!;
        $steps.text = intString(steps);
        goalLine($stepsLine, 40, steps / goals.steps!)
        const floors = today.adjusted.elevationGain!;
        $floors.text = intString(floors);
        goalLine($floorsLine, 80, floors / goals.elevationGain!)
    };
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
    const updateSensor = () =>
        display.on
            ? hrm.start()
            : hrm.stop();
    display.addEventListener("change", updateSensor);
    updateSensor();
} else {
    hideParent($hr);
}
