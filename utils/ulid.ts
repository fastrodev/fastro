import dayjs from "npm:dayjs";

export function ulidToDate(ulid: string) {
    // Base32 character set
    const base32Chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

    // Extract the timestamp part (first 10 characters)
    const timestampPart = ulid.slice(0, 10);

    // Convert base32 to decimal
    let timestamp = 0;
    for (let i = 0; i < timestampPart.length; i++) {
        const charIndex = base32Chars.indexOf(timestampPart[i]);
        timestamp = timestamp * 32 + charIndex;
    }

    // Create a Date object (timestamp is in milliseconds)
    const date = new Date(timestamp);

    // Return ISO string format
    return date.toISOString();
}

export function formatTime(isoDateString: string): string {
    const date = dayjs(isoDateString);
    const now = dayjs();

    // Check if the time difference is less than 1 minute
    if (now.diff(date, "minute") < 1) {
        return "• now";
    }

    // Check if the time difference is less than 1 hour
    if (now.diff(date, "hour") < 1) {
        const minutesAgo = now.diff(date, "minute");
        return `• ${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
    }

    // Check if the time difference is less than 1 day
    if (now.diff(date, "day") < 1) {
        const hoursAgo = now.diff(date, "hour");
        return `• ${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
    }

    // Check if the time difference is less than 1 year
    if (now.diff(date, "year") < 1) {
        const monthsAgo = now.diff(date, "month");
        return `• ${monthsAgo} month${monthsAgo !== 1 ? "s" : ""} ago`;
    }

    // Format for dates older than a day
    const formattedDate = date.format("MM/DD/YYYY hh:mm A");
    return `• ${formattedDate}`;
}
