// Add zero in front of numbers < 10
export function zeroPad(i: number, len: number=2) {
    let s = i.toString();
    while (s.length < len) s = "0" + s;
    return s;
}

export function intString(i: number | null | undefined) {
    if (i == undefined) return "-";
    if (i < 1) return "0";
    i = Math.floor(i);
    let result = "";
    while (i > 0) {
        if (result.length > 0) result = "," + result;
        result = (i > 999
            ? zeroPad(i % 1000, 3)
            : i
        ) + result
        i = Math.floor(i / 1000);
    }
    return result;
}

export function deg2rad(deg: number) {
    return deg * Math.PI / 180;
}

export function getDateString(d: Date) {
    return dayName(d.getDay()) + ", " + d.getDate() + " " + monthName(d.getMonth());
}

export function getTimeString(d: Date) {
    const hours = d.getHours()
    return (hours === 0 ? 12 : hours <= 12 ? hours : hours % 12) + ":" + zeroPad(d.getMinutes());
}

export function dayName(day: number) {
    switch (day) {
        case 0: return "Sun";
        case 1: return "Mon";
        case 2: return "Tue";
        case 3: return "Wed";
        case 4: return "Thu";
        case 5: return "Fri";
        case 6: return "Sat";
    }
}

export function monthName(month: number) {
    switch (month) {
        case 0: return "Jan";
        case 1: return "Feb";
        case 2: return "Mar";
        case 3: return "Apr";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "Aug";
        case 8: return "Sep";
        case 9: return "Oct";
        case 10: return "Nov";
        case 11: return "Dec";
    }
}
