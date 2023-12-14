import {Congestion} from "../entity/Congestion";

interface ICongestionRepository {
    updateCongestion(congestion: Congestion): Promise<Congestion>;
    fetchCongestionByAreaNum(areaNum: number): Promise<Congestion>;
    fetchAllCongestion(): Promise<Congestion[]>;
}

export default ICongestionRepository;