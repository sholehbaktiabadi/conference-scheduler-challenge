const ScheduleOptimizer = require("../src/scheduler");
const { testSessions, invalidSessions } = require("./fixtures/testData");

describe("ScheduleOptimizer", () => {
    let optimizer;

    beforeEach(() => {
        optimizer = new ScheduleOptimizer();
    });

    describe("input validation", () => {
        test("should throw error for invalid input format", () => {
            expect(() => {
                optimizer.validateInput("not an array");
            }).toThrow();
        });

        test("should throw error for invalid session data", () => {
            expect(() => {
                optimizer.validateInput(invalidSessions);
            }).toThrow();
        });
    });

    describe("schedule optimization", () => {
        test("should return valid schedule", () => {
            const schedule = optimizer.optimizeSchedule(testSessions);

            expect(Array.isArray(schedule)).toBe(true);
            expect(schedule.length).toBeGreaterThan(0);

            schedule.forEach((session) => {
                expect(session).toHaveProperty("id");
                expect(session).toHaveProperty("title");
                expect(session).toHaveProperty("startTime");
                expect(session).toHaveProperty("endTime");
                expect(session).toHaveProperty("popularity");
            });
        });

        test("should not have overlapping sessions", () => {
            const schedule = optimizer.optimizeSchedule(testSessions);

            for (let i = 0; i < schedule.length - 1; i++) {
                const currentEnd = new Date(
                    `2024-01-01T${schedule[i].endTime}`
                );
                const nextStart = new Date(
                    `2024-01-01T${schedule[i + 1].startTime}`
                );

                expect(nextStart - currentEnd).toBeGreaterThanOrEqual(
                    15 * 60 * 1000
                );
            }
        });

        // Add more test cases as needed
    });
});
