import {CongestionRepository} from "../driver/CongestionRepository";
import ICongestionRepository from "../driver/ICongestionRepository";
import {AppSyncResolverEvent, Callback} from "aws-lambda";
import {Query, QueryFetchCongestionByAreaNumArgs} from "../graphql";
import {convertToUnixTime} from "@/util/dateConverter";

const fetchCongestionByAreaNum = async (event: AppSyncResolverEvent<QueryFetchCongestionByAreaNumArgs>, callback: Callback):Promise<Query["fetchCongestionByAreaNum"]> => {
    const repository: ICongestionRepository = new CongestionRepository();
    try {
        const resultCongestion = await repository.fetchCongestionByAreaNum(event.arguments.areaNum);
        if (resultCongestion == null) {
            throw new Error("No congestion data")
        } else if (resultCongestion.AreaNum!== event.arguments.areaNum) {
            throw new Error("Unexpected error occurred! when fetching congestion data")
        }
        return {
            areaNum: resultCongestion.AreaNum,
            updatedAt: convertToUnixTime(resultCongestion.UpdatedAt),
            congestionLevel: resultCongestion.CongestionLevel
        };
    } catch (e) {
        throw new Error(e);
    }
}

const fetchAllCongestions = async (event: AppSyncResolverEvent<QueryFetchCongestionByAreaNumArgs>, callback: Callback):Promise<Query["fetchAllCongestions"]> => {
    const repository: ICongestionRepository = new CongestionRepository();
    try {
        const resultCongestions = await repository.fetchAllCongestion();
        if (resultCongestions.length === 0) {
            throw new Error("No congestion data")
        }
        let returnValue: Query["fetchAllCongestions"] = [];
        resultCongestions.map((congestion) => {
            returnValue.push({
                areaNum: congestion.AreaNum,
                updatedAt: convertToUnixTime(congestion.UpdatedAt),
                congestionLevel: congestion.CongestionLevel
            });
        })
        return returnValue;
    } catch (e) {
        throw new Error(e);
    }
}

export {fetchCongestionByAreaNum, fetchAllCongestions};