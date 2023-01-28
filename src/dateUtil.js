import * as dateMath from 'date-arithmetic'

const now = Date.now();

export const datesList = {
    weekOne: {
        sat: dateMath.add(now, 7, "day"),
        sun: dateMath.add(now, 8, "day")
    },
    weekTwo: {
        sat: dateMath.add(now, 14, "day"),
        sun: dateMath.add(now, 15, "day")
    },
    weekThree: {
        sat: dateMath.add(now, 21, "day"),
        sun: dateMath.add(now, 22, "day")
    },
    weekFour: {
        sat: dateMath.add(now, 28, "day"),
        sun: dateMath.add(now, 29, "day")
    },
    weekFive: {
        sat: dateMath.add(now, 35, "day"),
        sun: dateMath.add(now, 36, "day")
    },
    weekSix: {
        sat: dateMath.add(now, 42, "day"),
        sun: dateMath.add(now, 43, "day")
    },
    weekSeven: {
        sat: dateMath.add(now, 49, "day"),
        sun: dateMath.add(now, 50, "day")
    },
    weekEight: {
        sat: dateMath.add(now, 56, "day"),
        sun: dateMath.add(now, 57, "day")
    },
    weekNine: {
        sat: dateMath.add(now, 63, "day"),
        sun: dateMath.add(now, 64, "day")
    },
    weekTen: {
        sat: dateMath.add(now, 70, "day"),
        sun: dateMath.add(now, 71, "day")
    },
    weekEleven: {
        sat: dateMath.add(now, 77, "day"),
        sun: dateMath.add(now, 78, "day")
    },
    weekTwelve: {
        sat: dateMath.add(now, 84, "day"),
        sun: dateMath.add(now, 85, "day")
    }
};