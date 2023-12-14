import {AppSyncResolverEvent, Callback} from "aws-lambda";
import {
    Mutation, MutationUpdateCongestionByAreaNumArgs, MutationUpdateCongestionByAreaNumWithStoreHashArgs,

} from "@/graphql";
import {Congestion} from "@/entity/Congestion";
import {CongestionRepository} from "@/driver/CongestionRepository";
import {convertToUnixTime} from "@/util/dateConverter";
import checkVerification from "@/util/algorithm";

const updateCongestionByAreaNum = async (event: AppSyncResolverEvent<MutationUpdateCongestionByAreaNumArgs>, callback: Callback): Promise<Mutation["updateCongestionByAreaNum"]> => {
    const targetCongestion = new Congestion(event.arguments.input.congestionLevel, event.arguments.input.areaNum, new Date());
    let resultCongestion: Congestion;
    try {
        resultCongestion = await new CongestionRepository().updateCongestion(targetCongestion);
        if (resultCongestion.AreaNum !== targetCongestion.AreaNum || resultCongestion.CongestionLevel !== targetCongestion.CongestionLevel) {
            throw new Error("The data before and after the change are not equal.");
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

const updateCongestionByStoreHash = async (event: AppSyncResolverEvent<MutationUpdateCongestionByAreaNumWithStoreHashArgs>, callback: Callback): Promise<Mutation["updateCongestionByAreaNumWithStoreHash"]> => {
    if (checkVerification(event.arguments.input.areaNum, event.arguments.storeHash)) {
        throw new Error("StoreHash is not valid");
    }
    return updateCongestionByAreaNum(event, callback);
}

export {updateCongestionByAreaNum, updateCongestionByStoreHash};