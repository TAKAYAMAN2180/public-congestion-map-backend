import {AppSyncResolverEvent, Callback, Context} from 'aws-lambda'
import {fetchCongestionByAreaNum, fetchAllCongestions} from '@/service/fetch'
import {updateCongestionByAreaNum, updateCongestionByStoreHash} from '@/service/update'

exports.handler = async (event: AppSyncResolverEvent<any>, _: Context, callback: Callback) => {
    console.log("event > " + JSON.stringify(event));

    let response: any;
    try {
        if (event.info.fieldName === 'updateCongestionByAreaNum') {
            response = await updateCongestionByAreaNum(event, callback);
        } else if (event.info.fieldName === 'updateCongestionByAreaNumWithStoreHash') {
            response = await updateCongestionByStoreHash(event, callback);
        } else if (event.info.fieldName === 'fetchAllCongestions') {
            response = await fetchAllCongestions(event, callback);
        } else if (event.info.fieldName === 'fetchCongestionByAreaNum') {
            response = await fetchCongestionByAreaNum(event, callback);
        } else {
            throw new Error("Action not found!");
        }
        return response;
    } catch (e) {
        callback(e);
    }
}