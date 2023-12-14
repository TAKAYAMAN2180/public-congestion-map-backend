export class Congestion {
    private congestionLevel: number;
    private readonly areaNum: number;
    private updatedAt: Date;

    constructor(congestionLevel: number, areaNum: number, updatedAt: Date) {
        if (congestionLevel <= -1 || congestionLevel >= 4) {
            throw new Error("congestionLevel is invalid");
        } else if(areaNum <= 0 || areaNum >= 53){
            throw new Error("areaNum is invalid");
        }else {
            this.congestionLevel = congestionLevel;
            this.areaNum = areaNum;
            this.updatedAt = updatedAt;
        }
    }

    get CongestionLevel(): number {
        return this.congestionLevel;
    }

    get AreaNum(): number {
        return this.areaNum;
    }

    get UpdatedAt(): Date {
        return this.updatedAt;
    }

    set CongestionLevel(congestionLevel: number) {
        this.congestionLevel = congestionLevel;
    }

    set UpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }
}