"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePromptContent = void 0;
const generatePromptContent = (languageCode, prompt) => {
    return `Based on the following profile, generate a complete and detailed weekly calisthenic routine in ${languageCode} language. This is week ${prompt.weekNumber} of the program. Return ONLY a JSON object without any additional text or headers. IMPORTANT: Your response must be complete and include ALL required information - do not truncate or abbreviate any part of the response.

Profile Information:
- Gender: ${prompt.gender}
- Age: ${prompt.age}
- Height: ${prompt.height}cm
- Weight: ${prompt.weight}kg
- Body Type: ${prompt.bodyType}
- Target Type: ${prompt.targetType}
- Experience Level: ${prompt.exerciseExperience}
- Physical Form: ${prompt.formType}
- Push-up Capacity: ${prompt.pushUpCapacity}
- Exercise Frequency: ${prompt.howOftenExercise}
- Available Equipment: ${prompt.exerciseEquipments.join(', ')}
- Focus Areas: ${prompt.focusAreaType.join(', ')}
- Training Days: ${prompt.trainingDays.join(', ')}
- Preferred Pace: ${prompt.preferredPace}
- Commitment Duration: ${prompt.commitmentDuration}
- Health Issues: ${prompt.hasKneePain ? 'Has knee pain' : 'No knee pain'}
- Bad Habits: ${prompt.badHabits.join(', ')}
- Daily Sleep: ${prompt.dailySleepDuration}
- Stress Level: ${prompt.stressFrequency}
- Energy Level: ${prompt.energyLevel}
- Motivation Level: ${prompt.motivationLevel}
- Motivation Sources: ${prompt.motivationSources.join(', ')}

Return a COMPLETE JSON object with the following structure. Do not truncate or omit any part of the response:
{
    "dailyRoutines": [
        {
            "day": "string",
            "duration": "string",
            "sections": {
                "warmUp": [
                    {
                        "name": "string",
                        "sets": "number",
                        "reps": "string",
                        "rest": "string",
                        "notes": "string",
                        "targetMuscles": ["string"],
                        "animationUrl": "string"
                    }
                ],
                "mainWorkout": [/* same structure as warmUp */],
                "coolDown": [/* same structure as warmUp */]
            }
        }
    ],
    "goals": ["string"],
    "tips": ["string"]
}

CRITICAL REQUIREMENTS:
1. Provide a COMPLETE response - do not truncate or abbreviate any part
2. Include ALL sections for each training day
3. Ensure the JSON structure is valid and complete
4. Include detailed exercise descriptions, proper rest periods, and progression-appropriate exercises
5. Do not omit any fields from the JSON structure
6. Ensure all arrays (dailyRoutines, goals, tips) have appropriate content`;
};
exports.generatePromptContent = generatePromptContent;
