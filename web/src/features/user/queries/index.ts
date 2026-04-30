export const userQueries = {
    myVotes: {
        key: ()=> ['users', 'me', 'votes'],
        endpoint: '/users/me/votes'
    }
};