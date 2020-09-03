const timezones = [
    '-12:00',
    '-11:00',
    '-10:00',
    '-09:30',
    '-09:00',
    '-08:00',
    '-07:00',
    '-06:00',
    '-05:00',
    '-04:00',
    '-03:30',
    '-03:00',
    '-02:00',
    '-01:00',
    '-00:00',
    '+00:00',
    '+01:00',
    '+02:00',
    '+03:00',
    '+03:30',
    '+04:00',
    '+04:30',
    '+05:00',
    '+05:30',
    '+05:45',
    '+06:00',
    '+06:30',
    '+07:00',
    '+08:00',
    '+08:45',
    '+09:00',
    '+09:30',
    '+10:00',
    '+10:30',
    '+11:00',
    '+12:00',
    '+12:45',
    '+13:00',
    '+14:00',
];
export function getAllDateStrings() {
    const fullYear = '2020';
    const month = '02';
    const date = '02';
    const timezonesSet = new Map();
    const hours = Array.from(Array(24), (_, i) => i);
    for (const timezone of timezones) {
        for (const hour of hours) {
            const isoDateString = `${fullYear}-${month}-${date}T${`0${hour}`.slice(-2)}:00:00.000${timezone}`;
            const jsonDate = new Date(isoDateString).toJSON();
            if (timezonesSet.has(jsonDate))
                continue;
            timezonesSet.set(jsonDate, {
                date: jsonDate,
                value: jsonDate.replace(/^(.+)T.+/i, '$1'),
            });
        }
    }
    return Array.from(timezonesSet);
}
