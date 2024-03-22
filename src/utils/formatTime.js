// import { format, getTime, formatDistanceToNow } from "date-fns";
import moment from "moment";
// ----------------------------------------------------------------------

// export function fDate(date) {
//   return format(new Date(date), "dd MMMM yyyy");
// }

// export function fDateTime(date) {
//   return format(new Date(date), "dd MMM yyyy HH:mm");
// }

// export function fTimestamp(date) {
//   return getTime(new Date(date));
// }

// export function fDateTimeSuffix(date) {
//   return format(new Date(date), "dd/MM/yyyy hh:mm p");
// }

// export function fToNow(date) {
//   return formatDistanceToNow(new Date(date), {
//     addSuffix: true,
//   });
// }

export function dateToFromNowDaily(myDate) {
  // get from-now for this date
  var fromNow = moment(myDate).fromNow();

  // ensure the date is displayed with today and yesterday
  return moment(myDate).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: "[Last] dddd",
    lastDay: "[Yesterday]",
    sameDay: "[Today]",

    // when the date is further away, use from-now functionality
    sameElse: function () {
      return "[" + fromNow + "]";
    },
  });
}
