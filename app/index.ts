import clock from "clock";
import document from "document";

clock.granularity = "minutes";

const hourHand = document.getElementById("hand_hour") as GroupElement;
const minuteHand = document.getElementById("hand_minute") as GroupElement;
clock.ontick = (evt) => {
    const now = evt.date;
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const hourRot = 360 / 12 * (hours + minutes / 60);
    const minRot = 360 / 60 * minutes;
    hourHand.groupTransform!.rotate.angle = hourRot;
    minuteHand.groupTransform!.rotate.angle = minRot;
}
