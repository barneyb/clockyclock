import { settingsStorage } from "settings";
import * as util from "../common/utils";
import { me as companion } from "companion";

if (!companion.permissions.granted("run_background")) {
    console.warn("We're not allowed to access to run in the background!");
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

companion.wakeInterval = MS_PER_DAY;

function handleWake() {
    updateGoal(settingsStorage.getItem("oauth") as string);
}

// Listen for the event
companion.addEventListener("wakeinterval", handleWake);

// Event happens if the companion is launched and has been asleep
if (companion.launchReasons.wokenUp) {
    handleWake();
}

function computeNewGoal(values: number[]) {
    if (values.length < 10) {
        return null;
    }
    values = values.slice()
        .sort((a, b) => a - b);
    const idx = Math.floor(values.length / 4 * 3); // ~75% percentile
    return values[idx];
}

function updateGoal(oauth: string) {
    if (!oauth) {
        console.log("cannot update goal w/ null OAuth setting")
        return;
    }
    let data = JSON.parse(oauth);
    const accessToken = data.access_token;

    let start = new Date();
    start.setDate(start.getDate() - 15);
    let startDate = util.dateString(start);
    let end = new Date();
    end.setDate(end.getDate() - 1);
    let endDate = util.dateString(end);

    fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${startDate}/${endDate}.json`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const values = data["activities-steps"]
                .map(it => it.value)
                .filter(it => it) as number[];
            const goal = computeNewGoal(values);
            if (goal) {
                fetch(`https://api.fitbit.com/1/user/-/activities/goals/daily.json?steps=${goal}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                }).catch(err => console.log('[POST]: ' + err));
            }
        })
        .catch(err => console.log('[FETCH]: ' + err));
}


// A user changes Settings
function handleSettingsChange(evt) {
    if (evt.key === "oauth") {
        updateGoal(evt.newValue as string);
    }
}

settingsStorage.addEventListener("change", handleSettingsChange);
