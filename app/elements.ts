import { goalY, rad2deg, rightEdge } from "../common/utils";

export function hideParent(el: Element) {
    hide(el.parent!);
}

export function showParent(el: Element) {
    show(el.parent!);
}

export function hide(el: Element) {
    (el as GraphicsElement).style.display = 'none';
}

export function show(el: Element) {
    (el as GraphicsElement).style.display = 'inline';
}

export function goalLine($line: GroupElement, originX: number, progress: number) {
    const originY = 336;
    const y = goalY(progress);
    const x = rightEdge(y);
    const dx = x - originX;
    const dy = y - originY;
    const deg = rad2deg(Math.atan2(dy, dx));
    const scale = Math.sqrt(dx * dx + dy * dy) / dx;
    const transform = $line.groupTransform!;
    transform.translate.x = originX;
    transform.translate.y = originY;
    transform.rotate.angle = deg;
    transform.scale.x = scale;
    transform.scale.y = 1;
}
