/**
 * Centralized configuration for the wedding invitation
 */

export const BRIDE_NAME = "Oshani";
export const BRIDE_FULL_NAME = "Oshani Herath";
export const BRIDE_ROLE = "The Bride";
export const BRIDE_PARENTS = "Daughter of Mr and Mrs.Herath";

export const GROOM_NAME = "Subhash";
export const GROOM_FULL_NAME = "Subhash Chamara Udayanga";
export const GROOM_ROLE = "The Groom";
export const GROOM_PARENTS = "Son of Mr and Mrs. Amaradasa";

export const COUPLE_NAMES = `${BRIDE_NAME} & ${GROOM_NAME}`;

// Full wedding date for countdown calculation
export const WEDDING_DATE_ISO = "2026-08-26T09:05:00"; 

// Formatted strings for UI display
export const WEDDING_DATE_DISPLAY = "Wednesday, August 26, 2026";
export const WEDDING_TIME_DISPLAY = "09:05 AM";
export const WEDDING_DAY_DISPLAY = "Wednesday Morning";

// Venue details
export const VENUE_NAME = "Jetwing Blue, Negombo";
export const VENUE_HOTEL = "Jetwing Blue, Negombo";
export const VENUE_HALL = "Ballroom";
export const VENUE_ADDRESS = "Jetwing Blue, Ethukala, Negombo, Sri Lanka";
export const VENUE_COORDINATES: [number, number] = [7.189510265259248, 79.85029709537112];

// Homecoming details
export const HOMECOMING_DATE_ISO = "2026-08-30T16:53:00";
export const HOMECOMING_DATE_DISPLAY = "Sunday, August 30, 2026";
export const HOMECOMING_TIME_DISPLAY = "05:10 PM";
export const HOMECOMING_VENUE_NAME = "The Grand Manali, Tangalle";
export const HOMECOMING_VENUE_HOTEL = "The Grand Manali";
export const HOMECOMING_VENUE_HALL = "Ballrooom";
export const HOMECOMING_VENUE_COORDINATES: [number, number] = [6.009626010731537, 80.82519194964494];   

// Backend API URL
// export const API_BASE_URL = "https://api.oshanisubhash.online";
export const API_BASE_URL = "http://localhost:8585";

// Frontend URL for guest links and QR codes
// export const FRONTEND_URL = "https://oshanisubhash.online";
export const FRONTEND_URL = "http://localhost:3000";
