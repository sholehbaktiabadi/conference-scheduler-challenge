# Conference Schedule Optimizer Challenge

## Time Limit: 30 minutes

### Problem Statement

You are tasked with implementing a conference schedule optimizer that maximizes attendee satisfaction while respecting various constraints.

### Setup

1. Clone this repository
2. Run `npm install`
3. Implement the required functionality in `src/scheduler.js`
4. Run tests with `npm test`

### Requirements

1. No two sessions can overlap
2. 15-minute break between sessions required
3. Conference runs 9:00 AM to 5:00 PM
4. Maximize sum of popularity scores
5. Prioritize popular talks during peak hours (11:00 AM - 2:00 PM)

### Input Format

```javascript
{
    id: string,
    title: string,
    duration: number, // in minutes
    popularity: number // 1-10
}
```

### Expected Output

```javascript
{
    id: string,
    title: string,
    startTime: string, // HH:mm format
    endTime: string,   // HH:mm format
    popularity: number
}
```

### Evaluation Criteria

- Correctness of the solution
- Code quality and organization
- Error handling
- Edge case handling
- Performance considerations

Good luck!
