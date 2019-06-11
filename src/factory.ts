import { FrameworkReportParser, PITReportParser, MajorReportParser } from "./parser";

export namespace ParserFactory {
    export function getInstance(name: string): FrameworkReportParser {
        if ('PIT' == name) {
            return new PITReportParser();
        } else if ('MAJOR' == name) {
            return new MajorReportParser();
        }
        else {
            throw `Invalid framework name ${name} provided`
        }
    }
}