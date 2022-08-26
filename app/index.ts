import clock from "clock";
import document from "document";
import { deg2rad, getDateString, getTimeString, intString } from "../common/utils";
import { me as appbit } from "appbit";
import { goals, today } from "user-activity"
import { display } from "display";
import { HeartRateSensor } from "heart-rate";

clock.granularity = "minutes";

const $date = document.getElementById("date")!;
const $time = document.getElementById("time")!;
clock.ontick = (e) => {
    const now = e.date;
    $date.text = getDateString(now);
    $time.text = getTimeString(now);
}

const $steps = document.getElementById("steps")!;
const $stepsLine = document.getElementById("steps-line") as GroupElement;
const $floors = document.getElementById("floors")!;
const $floorsLine = document.getElementById("floors-line") as GroupElement;
const updateActivity = () => {
    if (!display.on) return;
    // todo: make this less duplicative
    let steps = "-", floors = "-";
    let stepPct = 0, floorPct = 0;
    if (appbit.permissions.granted("access_activity")) {
        steps = intString(today.adjusted.steps);
        stepPct = Math.min(1, today.adjusted.steps! / goals.steps!);
        floors = intString(today.adjusted.elevationGain);
        floorPct = Math.min(1, today.adjusted.elevationGain! / goals.elevationGain!);
    }
    $steps.text = steps;
    let angle = -45 * stepPct;
    let scale = 1 / Math.cos(Math.abs(deg2rad(angle)));
    $stepsLine.groupTransform!.rotate.angle = angle;
    $stepsLine.groupTransform!.scale.x = scale;
    angle = -45 * floorPct;
    scale = 1 / Math.cos(Math.abs(deg2rad(angle)));
    $floorsLine.groupTransform!.rotate.angle = angle;
    $floorsLine.groupTransform!.scale.x = scale;
    $floors.text = floors;
};
display.addEventListener("change", updateActivity);
updateActivity();

if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const $hr = document.getElementById("hr")!;
    const hrm = new HeartRateSensor({ frequency: 2, });
    hrm.addEventListener("reading", () => {
        console.log("HR: " + hrm.heartRate);
        $hr.text = intString(hrm.heartRate);
    });
    display.addEventListener("change", () => {
        if (display.on) {
            hrm.start();
        } else {
            hrm.stop();
        }
    });
    hrm.start();
}
