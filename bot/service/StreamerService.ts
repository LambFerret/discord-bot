import StreamerRepository from "../repository/StreamerRepository";

export default class StreamerService {
    streamerRepository: StreamerRepository;
    constructor() {
        this.streamerRepository = new StreamerRepository();
    }
}