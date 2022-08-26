import { deg2rad } from "../common/utils";

export function hideParent(el: Element) {
    (el.parent as GraphicsElement).style.opacity = 0;
}

export function goalLine($line: GroupElement, actual: number, goal: number) {
    const pct = actual / goal;
    const angle = -45 * pct;
    const scale = 1 / Math.cos(Math.abs(deg2rad(angle)));
    $line.groupTransform!.rotate.angle = angle;
    $line.groupTransform!.scale.x = scale;
}
