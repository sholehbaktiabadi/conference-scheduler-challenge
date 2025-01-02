const lodash = require("lodash");
const moment = require("moment");

class ScheduleOptimizer {
    constructor() {
        this.startTime = "09:00";
        this.endTime = "17:00";
        this.peakStart = "11:00";
        this.peakEnd = "14:00";
        this.breakDuration = 15; 
    }

    validateInput(sessions) {
        if (!Array.isArray(sessions)) {
            throw new Error("Input must be an array of sessions");
        }

        sessions.forEach((session, index) => {
            if (
                !session.id ||
                typeof session.id !== "string" ||
                !session.title ||
                typeof session.title !== "string" ||
                typeof session.duration !== "number" ||
                session.duration <= 0 ||
                typeof session.popularity !== "number" ||
                session.popularity < 1 ||
                session.popularity > 10
            ) {
                throw new Error(`Invalid session data at index ${index}`);
            }
        });
    }

    optimizeSchedule(sessions) {
        this.validateInput(sessions);

        const startMinutes = moment.duration(this.startTime).asMinutes();
        const endMinutes = moment.duration(this.endTime).asMinutes();
        const peakStartMinutes = moment.duration(this.peakStart).asMinutes();
        const peakEndMinutes = moment.duration(this.peakEnd).asMinutes();


        const popularityScores = lodash.map(sessions, 'popularity');
        const sortedScores = lodash.sortBy(popularityScores);

        const midIndex = Math.floor(sortedScores.length / 2);

        const median =
            sortedScores.length % 2 === 0
                ? (sortedScores[midIndex - 1] + sortedScores[midIndex]) / 2
                : sortedScores[midIndex];

        
        const [peakSessions, nonPeakSessions] = lodash.partition(
            sessions,
            (session) => session.popularity >= median
        );

        
        const sortedPeakSessions = lodash.orderBy(
            peakSessions,
            ["popularity", "duration"],
            ["desc", "asc"]
        );

        
        const sortedNonPeakSessions = lodash.orderBy(
            nonPeakSessions,
            ["popularity", "duration"],
            ["desc", "asc"]
        );

        let currentTime = startMinutes;
        const schedule = [];

        
        for (const session of sortedNonPeakSessions) {
            const sessionStartTime = currentTime;
            const sessionEndTime = sessionStartTime + session.duration;

            if (sessionEndTime > peakStartMinutes) {
                break; 
            }

            if (schedule.length > 0) {
                const lastSessionEnd = moment.duration(schedule[schedule.length - 1].endTime).asMinutes();
                if (sessionStartTime < lastSessionEnd + this.breakDuration) {
                    continue; 
                }
            }

            schedule.push({
                id: session.id,
                title: session.title,
                startTime: moment.utc(sessionStartTime * 60000).format("HH:mm"),
                endTime: moment.utc(sessionEndTime * 60000).format("HH:mm"),
                popularity: session.popularity,
            });

            currentTime = sessionEndTime + this.breakDuration; 
        }

        
        currentTime = Math.max(currentTime, peakStartMinutes);

        
        for (const session of sortedPeakSessions) {
            const sessionStartTime = Math.max(currentTime, peakStartMinutes);
            const sessionEndTime = sessionStartTime + session.duration;

            if (sessionEndTime > peakEndMinutes) {
                continue; 
            }

            if (schedule.length > 0) {
                const lastSessionEnd = moment.duration(schedule[schedule.length - 1].endTime).asMinutes();
                if (sessionStartTime < lastSessionEnd + this.breakDuration) {
                    continue; 
                }
            }

            schedule.push({
                id: session.id,
                title: session.title,
                startTime: moment.utc(sessionStartTime * 60000).format("HH:mm"),
                endTime: moment.utc(sessionEndTime * 60000).format("HH:mm"),
                popularity: session.popularity,
            });

            currentTime = sessionEndTime + this.breakDuration; 
        }

        
        currentTime = Math.max(currentTime, peakEndMinutes);
        for (const session of sortedNonPeakSessions) {
            if (schedule.some((s) => s.id === session.id)) {
                continue; 
            }

            const sessionStartTime = currentTime;
            const sessionEndTime = sessionStartTime + session.duration;

            if (sessionEndTime > endMinutes) {
                break; 
            }

            if (schedule.length > 0) {
                const lastSessionEnd = moment.duration(schedule[schedule.length - 1].endTime).asMinutes();
                if (sessionStartTime < lastSessionEnd + this.breakDuration) {
                    continue; 
                }
            }

            schedule.push({
                id: session.id,
                title: session.title,
                startTime: moment.utc(sessionStartTime * 60000).format("HH:mm"),
                endTime: moment.utc(sessionEndTime * 60000).format("HH:mm"),
                popularity: session.popularity,
            });

            currentTime = sessionEndTime + this.breakDuration;
        }
        return schedule;
    }
}

module.exports = ScheduleOptimizer;
