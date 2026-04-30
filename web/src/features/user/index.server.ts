import 'server-only';

import { userQueries } from './queries';
import { fetchVotesServer } from "./services/user.service";

export {
    fetchVotesServer,
    userQueries
}