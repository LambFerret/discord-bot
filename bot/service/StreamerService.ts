import StreamerRepository from "../repository/StreamerRepository";


class StreamerService {
    streamerRepository: StreamerRepository;
    constructor() {
        this.streamerRepository = new StreamerRepository();
    }

    
}