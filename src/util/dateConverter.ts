function convertToUnixTime(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

function convertToDateInstance(unixTime: number): Date {
    return new Date(unixTime * 1000);
}

export {convertToUnixTime, convertToDateInstance}