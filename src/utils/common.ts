import momentTimezone from "moment-timezone";
import moment from "moment";

export function current_timestamp() {
    return parseInt(momentTimezone.tz('Asia/Yangon').format('yyMMDHHmmss'));
}

export function format_date(value: string) {
    return moment(value).format('yyMMDHHmmss');
}
  