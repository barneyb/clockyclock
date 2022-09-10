import clock from "clock";
import document from "document";
import { getDateString, getTimeString } from "../common/utils";
import { me as appbit } from "appbit";
import { goals, today } from "user-activity"
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { hide, LineIndicator, NumberIndicator, show } from "./elements";
import sleep from "sleep";

clock.granularity = "minutes";

const $core = document.getElementById("core") as GroupElement;
const $date = document.getElementById("date") as GraphicsElement;
const $time = document.getElementById("time") as GraphicsElement;
clock.ontick = (e) => {
    const now = e.date;
    $date.text = getDateString(now);
    $time.text = getTimeString(now);
}

const stepIndicator = new LineIndicator(
    document.getElementById("steps") as TextElement,
    document.getElementById("steps-line") as GroupElement,
    20
);
const floorIndicator = new LineIndicator(
    document.getElementById("floors") as TextElement,
    document.getElementById("floors-line") as GroupElement,
    60
);
const updateActivity = () => {
    if (!display.on) return;
    stepIndicator.update(today.adjusted.steps!, goals.steps!);
    floorIndicator.update(today.adjusted.elevationGain!, goals.elevationGain!);
    updateSleep();
};

function isAsleep() {
    return sleep && sleep!.state === "asleep";
}

const $stats = document.getElementById("stats")!;
const $ticks = document.getElementById("ticks")!;
const updateSleep = () => {
    if (isAsleep()) {
        stepIndicator.hide()
        floorIndicator.hide()
        hide($stats)
        hide($ticks)
        $core.style.opacity = 0.3;
    } else {
        stepIndicator.show()
        floorIndicator.show()
        show($stats)
        show($ticks)
        $core.style.opacity = 1;
    }
};
if (appbit.permissions.granted("access_activity")) {
    display.addEventListener("change", updateActivity);
    updateActivity();
} else {
    stepIndicator.hide()
    floorIndicator.hide()
}

const hrIndicator = new NumberIndicator(
    document.getElementById("hr") as TextElement
);
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const hrm = new HeartRateSensor({ frequency: 2, });
    hrm.addEventListener("reading", () => {
        if (!display.on) return;
        hrIndicator.update(hrm.heartRate!);
    });
    const updateHeartRate = () =>
        display.on
            ? hrm.start()
            : hrm.stop();
    display.addEventListener("change", updateHeartRate);
    updateHeartRate();
} else {
    hrIndicator.hide();
}

if (sleep && appbit.permissions.granted("access_sleep")) {
    sleep.addEventListener("change", updateSleep);
    updateSleep();
} else {
    console.warn("Sleep API not supported on this device, or no permission")
}
