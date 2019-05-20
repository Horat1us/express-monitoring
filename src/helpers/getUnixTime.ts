export const getUnixTime: () => number = () => {
    return (new Date).getTime() / 1000;
};
