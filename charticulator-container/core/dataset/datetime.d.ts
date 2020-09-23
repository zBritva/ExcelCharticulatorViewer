/**
 * Parse a date string.
 *
 * Expected formats: DateFormat TimeFormat TimezoneFormat
 * - DateFormats:
 *   - YYYY-MM, YYYY-MM-DD
 *   - MM/YYYY, MM/DD/YYYY
 * - TimeFormats:
 *   - HH:MM, HH:MM:SS
 *   - HH:MM{am/pm}, HH:MM:SS{am/pm}
 * - TimezoneFormat:
 *   - +HH:MM, -HH:MM
 *
 * If no timezone is specified, UTC is assumed
 *
 * @param str the date string
 * @returns the parsed Date's unix timestamp (in milliseconds) or null if unable to parse
 */
export declare function parseDate(str: string): number;
export declare const monthNames: string[];
/** Check if a string is a month name, if yes, return a normalized version */
export declare function testAndNormalizeMonthName(str: string): string;
