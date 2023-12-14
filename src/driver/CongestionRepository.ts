import ICongestionRepository from "./ICongestionRepository";
import {Congestion} from "@/entity/Congestion";
import {
    DynamoDBDocumentClient,
    UpdateCommand,
    QueryCommand,
    QueryCommandInput,
    UpdateCommandInput
} from "@aws-sdk/lib-dynamodb";
import * as process from "process";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {convertToDateInstance, convertToUnixTime} from "@/util/dateConverter";

export class CongestionRepository implements ICongestionRepository {
    private readonly TABLE_NAME = process.env.TABLE_NAME;
    private readonly DYNAMODB_CLIENT: DynamoDBDocumentClient;

    constructor() {
        let client: DynamoDBClient;
        if (process.env.STAGE === "local") {
            client = new DynamoDBClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000',
            });
        } else {
            client = new DynamoDBClient({
                region: process.env.REGION
            });
        }
        this.DYNAMODB_CLIENT = DynamoDBDocumentClient.from(client);
    }

    async updateCongestion(congestion: Congestion): Promise<Congestion> {
        const param: UpdateCommandInput = {
            TableName: this.TABLE_NAME,
            Key: {
                PK: 'Store',
                SK: Number(congestion.AreaNum)
            },
            UpdateExpression: 'SET #congestionLevel = :congestionLevel, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#congestionLevel': 'congestionLevel',
                '#updatedAt': 'updatedAt'
            },
            ExpressionAttributeValues: {
                ':congestionLevel': Number(congestion.CongestionLevel),
                ':updatedAt': Number(convertToUnixTime(congestion.UpdatedAt))
            },
            ReturnValues: 'ALL_NEW'
        }
        let returnValue: null | Congestion = null;
        try {
            const result = await this.DYNAMODB_CLIENT.send(new UpdateCommand(param));
            console.log(JSON.stringify(result));
            returnValue = new Congestion(Number(result.Attributes.congestionLevel), Number(result.Attributes.SK), convertToDateInstance(result.Attributes.updatedAt));
            console.log("updateCongestion is success: " + JSON.stringify(result));
        } catch (e) {
            console.log("updateCongestion is failed: " + e);
            throw e;
        }
        return returnValue;
    }

    async fetchCongestionByAreaNum(areaNum: number): Promise<Congestion> {
        const param: QueryCommandInput = {
            TableName: this.TABLE_NAME,
            KeyConditionExpression: '#PK = :PK and #SK = :SK',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'SK'
            },
            ExpressionAttributeValues: {
                ':PK': 'Store',
                ':SK': Number(areaNum)
            }
        }

        let returnValue: null | Congestion = null;
        try {
            const result = await this.DYNAMODB_CLIENT.send(new QueryCommand(param));
            returnValue = new Congestion(result.Items[0].congestionLevel, result.Items[0].SK, convertToDateInstance(result.Items[0].updatedAt));
            console.log("fetchCongestionByAreaNum is success: " + JSON.stringify(result));
        } catch (e) {
            console.log("fetchCongestionByAreaNum is failed: " + JSON.stringify(e));
            throw e;
        }
        return returnValue;
    }

    async fetchAllCongestion(): Promise<Congestion[]> {
        const param: QueryCommandInput = {
            TableName: this.TABLE_NAME,
            KeyConditionExpression: '#PK = :PK',
            ExpressionAttributeNames: {
                '#PK': 'PK'
            },
            ExpressionAttributeValues: {
                ':PK': 'Store'
            }
        }

        const returnValue: Congestion[] = [];
        return this.DYNAMODB_CLIENT.send(new QueryCommand(param)).then(result => {
            result.Items.forEach(item => {
                returnValue.push(new Congestion(item.congestionLevel, item.SK, convertToDateInstance(item.updatedAt)));
            })
            console.log("fetchAllCongestion is success: " + JSON.stringify(result));
            return returnValue;
        }).catch(e => {
            console.log("fetchAllCongestion is failed: " + JSON.stringify(e));
            throw e;
        })
    }
}