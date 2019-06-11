import { readFileSync } from "fs";
import { xml2json } from "xml-js";
import { parse as csvparse } from "papaparse";
import { ParserFactory } from "./factory";

/**
 *  A model representing a single mutation result.
 */
export interface Mutation {
    isDetected: boolean;
    status: string;
    mutatedClass: string;
    mutatedMethod: string;
    methodDescription: string | undefined;
    lineNumber: number;
    mutator: string;
    index: number;
    killingTest: string;
    mutatorDescription: string;
    sourceFile: string;
}

/**
 * Holds the numbers of live, killed and total mutants
 */
export interface MutationCounts {
    totalMutationCount: number;
    killedMutationCount: number;
    livedMutationCount: number;
}

/**
 * High level summary and file level summary of entire mutation run
 */
export interface MutationSummary {
    overallSummary: MutationCounts;
    fileLevelSummary: Map<string, MutationCounts>;
}

/**
 * Full mutation report including the summary and the list of all mutations
 */
export interface MutationReport {
    mutationSummary: MutationSummary;
    mutations: Mutation[];
}


/**
 * Interface for creating a new framework report parser
 */
export interface FrameworkReportParser {
    parseReport(reportFileContents: string): MutationReport;
}

/**
 * Parses a PIT mutation report into a MutationReport object
 */
export class PITReportParser implements FrameworkReportParser {

    /**
     * Parses a PIT mutation report into a MutationReport object
     *  @param reportFileContents Full content of the mutation report file
     */
    parseReport(reportFileContents: string): MutationReport {
        let mutations: Mutation[] = [];
        const result: any = JSON.parse(xml2json(reportFileContents, { compact: true }));

        for (const mutation of result.mutations.mutation) {
            mutations.push({
                isDetected: mutation._attributes.detected === "true",
                status: mutation._attributes.status,
                mutatedClass: mutation.mutatedClass._text,
                mutatedMethod: mutation.mutatedMethod._text,
                methodDescription: mutation.methodDescription._text,
                lineNumber: +mutation.lineNumber._text,
                mutator: mutation.mutator._text,
                index: +mutation.index._text,
                killingTest: mutation.killingTest._text,
                mutatorDescription: mutation.description._text,
                sourceFile: mutation.sourceFile._text,
            });
        }
        return { mutations: mutations, mutationSummary: generateOverallSummary(mutations) };
    }

}

/**
 * Parses a Major mutation report into a MutationReport object
 */
export class MajorReportParser implements FrameworkReportParser {
    
    /**
     * Parses a Major mutation report into a MutationReport object
     * @param reportFileContents Full content of the mutation report file
     */
    parseReport(reportFileContents: string): MutationReport {
        let mutations: Mutation[] = [];

        const result = csvparse(reportFileContents).data;
        return {
            mutations: mutations,
            mutationSummary: {
                overallSummary: {
                    totalMutationCount: result[1][1],
                    killedMutationCount: result[1][2],
                    livedMutationCount: result[1][3]
                },
                fileLevelSummary: new Map<string, MutationCounts>()
            }
        };
    }

}

/**
 * Generates high level summary and file level summary for a list of mutations
 * @param mutations List of mutations for which to generate the summary
 */
function generateOverallSummary(mutations: Mutation[]): MutationSummary {
    let result: Map<string, MutationCounts> = new Map<string, MutationCounts>();
    let totalMutationCount: number = 0;
    let killedMutationCount: number = 0;
    let livedMutationCount: number = 0;

    for (const mutation of mutations) {
        totalMutationCount++;
        const killingTestName: string = mutation.killingTest;
        let fileCounts: MutationCounts | undefined = result.get(killingTestName);
        if (mutation.isDetected) {
            killedMutationCount++;
            if (fileCounts === undefined) {
                result.set(killingTestName, {
                    totalMutationCount: 1,
                    killedMutationCount: 1,
                    livedMutationCount: 0
                });
            } else {
                fileCounts.killedMutationCount++;
                fileCounts.totalMutationCount++;
                result.set(killingTestName, fileCounts);
            }
        } else {
            livedMutationCount++;
            if (fileCounts === undefined) {
                result.set(killingTestName, {
                    totalMutationCount: 1,
                    killedMutationCount: 0,
                    livedMutationCount: 1
                });
            } else {
                fileCounts.livedMutationCount++;
                fileCounts.totalMutationCount++;
                result.set(killingTestName, fileCounts);
            }
        }
    }
    return {
        fileLevelSummary: result,
        overallSummary: {
            totalMutationCount: totalMutationCount,
            killedMutationCount: killedMutationCount,
            livedMutationCount: livedMutationCount
        }
    };
}

/**
 * A class which can parse a Mutation Testing report based on the current mutation
 * framework configured.
 */
export class MutationReportParser {
    report: MutationReport;
    reportFilePath: string;
    mutationFramework: string;

    constructor(reportFilePath: string, mutationFramework: string = 'PIT') {
        this.reportFilePath = reportFilePath;
        this.mutationFramework = mutationFramework;

        const reportFileContents: string = readFileSync(reportFilePath, 'utf-8');

        // TODO: determine framework name from config
        this.report = ParserFactory.getInstance(mutationFramework).parseReport(reportFileContents);
    }

    /**
     * List of mutation in this test report.
     */
    public getMutations(): Mutation[] {
        return this.report.mutations;
    }

    /**
     * Gets the overall mutation report
     */
    public getMutationReport(): MutationReport {
        return this.report;
    }

    /**
     * Refreshes the parsed report information. This can be useful
     * in cases where new tests are added and the mutation report changes.
     */
    public refreshReport() {
        const reportFileContents: string = readFileSync(this.reportFilePath, 'utf-8');
        this.report = ParserFactory.getInstance(this.mutationFramework).parseReport(reportFileContents);
    }
}
