export default date => {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    date = new Date(parseInt(date));
    const ourDate = new Date();
    const dateObject = {
        M: date.getMonth(),
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        y: date.getFullYear()
    };
    const ourDateObject = {
        M: ourDate.getMonth(),
        d: ourDate.getDate(),
        h: ourDate.getHours(),
        m: ourDate.getMinutes(),
        y: ourDate.getFullYear()
    };
    //console.log(date, "-", ourDate, dateObject, ourDateObject);
    if (dateObject.y !== ourDateObject.y)
        return monthNames[dateObject.M] + " " + dateObject.y;
    else if (dateObject.M !== ourDateObject.M)
        return monthNames[dateObject.M] + " " + dateObject.d;
    else {
        let diff = 0;
        if (dateObject.d !== ourDateObject.d) {
            diff =
                (ourDateObject.d - dateObject.d) * 24 - dateObject.h + ourDateObject.h;
            if (diff >= 24) return dateObject.d + ", " + monthNames[dateObject.M];
            else if (diff !== 0) return diff + " hr's ago";
        }
        diff =
            (ourDateObject.h - dateObject.h) * 60 - dateObject.m + ourDateObject.m;
        if (diff > 60) return ourDateObject.h - dateObject.h + " hr's ago";
        return diff + " min's ago";
    }
};
