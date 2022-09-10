import { goalY, intString, rad2deg, rightEdge } from "../common/utils";

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

export class NumberIndicator {
    $text: TextElement;

    constructor($text: TextElement) {
        this.$text = $text;
    }

    hide() {
        hideParent(this.$text)
    }

    show() {
        showParent(this.$text)
    }

    update(value: number, goal?: number | undefined) {
        this.$text.text = intString(value);
    }
}

export class LineIndicator extends NumberIndicator {
    $line: GroupElement;
    xOffset: number;
    hidden = false;

    constructor($text: TextElement, $line: GroupElement, xOffset = 0) {
        super($text);
        this.$line = $line;
        this.xOffset = xOffset;
    }

    hide() {
        super.hide()
        hide(this.$line)
    }

    show() {
        super.show()
        show(this.$line)
    }

    update(value: number, goal: number | undefined) {
        super.update(value, goal);
        if (goal) {
            const stepFactor = value / goal;
            goalLine(this.$line, this.xOffset, stepFactor);
            if (this.hidden) show(this.$line)
            this.hidden = false
        } else {
            if (!this.hidden) hide(this.$line)
            this.hidden = true
        }
    }

}
