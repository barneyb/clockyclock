// Add zero in front of numbers < 10
export function zeroPad(i: number) {
    return (i < 10 ? "0" : "") + i;
}

export function dateString(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //YYYY-MM-DD
}
