import { goalY, rad2deg, rightEdge } from "../common/utils";

export function hideParent(el: Element) {
    (el.parent as GraphicsElement).style.display = 'none';
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
