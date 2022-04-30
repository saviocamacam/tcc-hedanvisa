
import * as moment from 'moment-business-days';
import * as calendar from 'holidays-calendar-brazil';

export default class DateUtils {
    /**
     * All dates in this class need to be ISO.
     */

    static stringfy(date: string | Date) {
        return date instanceof Date ? date.toISOString() : date;
    }

    static fastFormat(date: string | Date) {
        date = DateUtils.stringfy(date);
        return date.slice(0, 10).split("-").reverse().join("/");
    }

    static fastFormat2(date: string | Date) {
        date = DateUtils.stringfy(date);
        return date.slice(5, 10).split("-").reverse().join("/");
    }

    static compare(date1: string | Date, date2: string | Date) {
        date1 = DateUtils.stringfy(date1);
        date2 = DateUtils.stringfy(date2);
        if (date1 > date2) return 1;
        if (date1 < date2) return -1;
        return 0;
    }

    static between(
        date: string | Date,
        before: string | Date,
        last: string | Date
    ) {
        date = DateUtils.stringfy(date);
        before = DateUtils.stringfy(before);
        last = DateUtils.stringfy(last);
        return date >= before && date <= last;
    }

    static intervalUtilsDays(date1, date2) {
        var d1 = moment(date1).nextBusinessDay();
        var d2 = moment(date2);

        const interval = [];
        while (d1 < d2) {
            interval.push(d1.toObject());
            d1 = d1.nextBusinessDay();
        }

        return interval.filter(day => !calendar.Day(day.years, day.months + 1, day.date));
    }
}
