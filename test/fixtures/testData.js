const testSessions = [
    { id: "1", title: "Keynote", duration: 60, popularity: 9 },
    { id: "2", title: "Web Security", duration: 45, popularity: 8 },
    { id: "3", title: "API Design", duration: 90, popularity: 7 },
    { id: "4", title: "Database Optimization", duration: 60, popularity: 6 },
    { id: "5", title: "Cloud Architecture", duration: 45, popularity: 8 },
];

const invalidSessions = [
    { id: "1", duration: 60 }, // Missing title and popularity
    { id: "2", title: "Test", duration: -30, popularity: 8 }, // Invalid duration
    { id: "3", title: "Test", duration: 45, popularity: 11 }, // Invalid popularity
];

module.exports = {
    testSessions,
    invalidSessions,
};
