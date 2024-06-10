module.exports = {

    sleep: (seconds) => {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
    },

    randomSleep: (min, max) => {
        return new Promise((resolve) => setTimeout(resolve, (Math.ceil(Math.random() * (max - min) + min)) * 1000))
    },
};
