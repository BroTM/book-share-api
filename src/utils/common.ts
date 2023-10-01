import momentTimezone from "moment-timezone";
import moment from "moment";

export function current_timestamp() {
    return parseInt(momentTimezone.tz('Asia/Yangon').format('yyMMDHHmmss'));
}

export function format_date(value: string) {
    return moment(value).format('yyMMDHHmmss');
}

export function paginate(query: any, page: number, pageSize: number) {
    const offset = page * pageSize;
    const limit = pageSize;

    return {
        offset: offset,
        limit: limit,
        ...query
    };
};