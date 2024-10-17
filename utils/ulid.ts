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
    const date = new Date(isoDateString);
    const now = new Date();

    // Get local date components
    const localYear = date.getFullYear();
    const localMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const localDay = String(date.getDate()).padStart(2, "0");
    const localHours = date.getHours();
    const localMinutes = String(date.getMinutes()).padStart(2, "0");

    // Check if the date is now
    if (
        date.toDateString() === now.toDateString() &&
        date.getTime() === now.getTime()
    ) {
        const formattedHours = localHours % 12 || 12; // Convert to 12-hour format
        const amPm = localHours < 12 ? "AM" : "PM";
        return `— Now at ${formattedHours}:${localMinutes} ${amPm}`;
    }

    // Format hours for 12-hour clock
    const formattedHours = localHours % 12 || 12; // Convert to 12-hour format
    const amPm = localHours < 12 ? "AM" : "PM";

    // Construct the desired format
    return `— ${localMonth}/${localDay}/${localYear} ${formattedHours}:${localMinutes} ${amPm}`;
}
