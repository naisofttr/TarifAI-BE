import { AgeRange } from '../enums/ageRange';
import { HeightRange } from '../enums/heightRange';
import { WeightRange } from '../enums/weightRange';
import { SquatCapacityRange } from '../enums/squatCapacityRange';
import { PlankDurationRange } from '../enums/plankDurationRange';
import { DailyWalkingDurationRange } from '../enums/dailyWalkingDurationRange';

export class RangeConverter {
    static getAgeRange(age: number): number {
        if (age >= 13 && age <= 18) return AgeRange.THIRTEEN_TO_EIGHTEEN;
        if (age >= 19 && age <= 24) return AgeRange.NINETEEN_TO_TWENTY_FOUR;
        if (age >= 25 && age <= 30) return AgeRange.TWENTY_FIVE_TO_THIRTY;
        if (age >= 31 && age <= 36) return AgeRange.THIRTY_ONE_TO_THIRTY_SIX;
        if (age >= 37 && age <= 42) return AgeRange.THIRTY_SEVEN_TO_FORTY_TWO;
        if (age >= 43 && age <= 48) return AgeRange.FORTY_THREE_TO_FORTY_EIGHT;
        if (age >= 49 && age <= 54) return AgeRange.FORTY_NINE_TO_FIFTY_FOUR;
        if (age >= 55 && age <= 60) return AgeRange.FIFTY_FIVE_TO_SIXTY;
        return AgeRange.THIRTEEN_TO_EIGHTEEN; // Default değer
    }

    static getHeightRange(height: number): number {
        if (height >= 150 && height <= 170) return HeightRange.ONE_FIFTY_TO_ONE_SEVENTY;
        if (height >= 171 && height <= 190) return HeightRange.ONE_SEVENTY_ONE_TO_ONE_NINETY;
        if (height >= 191 && height <= 210) return HeightRange.ONE_NINETY_ONE_TO_TWO_TEN;
        return HeightRange.ONE_FIFTY_TO_ONE_SEVENTY; // Default değer
    }

    static getWeightRange(weight: number): number {
        if (weight >= 40 && weight <= 50) return WeightRange.FORTY_TO_FIFTY;
        if (weight >= 51 && weight <= 60) return WeightRange.FIFTY_ONE_TO_SIXTY;
        if (weight >= 61 && weight <= 70) return WeightRange.SIXTY_ONE_TO_SEVENTY;
        if (weight >= 71 && weight <= 80) return WeightRange.SEVENTY_ONE_TO_EIGHTY;
        if (weight >= 81 && weight <= 90) return WeightRange.EIGHTY_ONE_TO_NINETY;
        if (weight >= 91 && weight <= 100) return WeightRange.NINETY_ONE_TO_HUNDRED;
        if (weight >= 101 && weight <= 110) return WeightRange.HUNDRED_ONE_TO_ONE_TEN;
        if (weight >= 111 && weight <= 120) return WeightRange.ONE_TEN_ONE_TO_ONE_TWENTY;
        if (weight >= 121 && weight <= 130) return WeightRange.ONE_TWENTY_ONE_TO_ONE_THIRTY;
        if (weight >= 131 && weight <= 140) return WeightRange.ONE_THIRTY_ONE_TO_ONE_FORTY;
        if (weight >= 141 && weight <= 150) return WeightRange.ONE_FORTY_ONE_TO_ONE_FIFTY;
        if (weight >= 151 && weight <= 160) return WeightRange.ONE_FIFTY_ONE_TO_ONE_SIXTY;
        if (weight >= 161 && weight <= 170) return WeightRange.ONE_SIXTY_ONE_TO_ONE_SEVENTY;
        if (weight >= 171 && weight <= 180) return WeightRange.ONE_SEVENTY_ONE_TO_ONE_EIGHTY;
        if (weight >= 181 && weight <= 190) return WeightRange.ONE_EIGHTY_ONE_TO_ONE_NINETY;
        if (weight >= 191 && weight <= 200) return WeightRange.ONE_NINETY_ONE_TO_TWO_HUNDRED;
        return WeightRange.FORTY_TO_FIFTY; // Default değer
    }

    static getSquatCapacityRange(squatCapacity: number): number {
        if (squatCapacity >= 1 && squatCapacity <= 30) return SquatCapacityRange.ONE_TO_THIRTY;
        if (squatCapacity >= 31 && squatCapacity <= 60) return SquatCapacityRange.THIRTY_ONE_TO_SIXTY;
        if (squatCapacity >= 61 && squatCapacity <= 90) return SquatCapacityRange.SIXTY_ONE_TO_NINETY;
        if (squatCapacity >= 91 && squatCapacity <= 120) return SquatCapacityRange.NINETY_ONE_TO_ONE_TWENTY;
        if (squatCapacity >= 121 && squatCapacity <= 150) return SquatCapacityRange.ONE_TWENTY_ONE_TO_ONE_FIFTY;
        if (squatCapacity >= 151 && squatCapacity <= 180) return SquatCapacityRange.ONE_FIFTY_ONE_TO_ONE_EIGHTY;
        if (squatCapacity >= 181 && squatCapacity <= 200) return SquatCapacityRange.ONE_EIGHTY_ONE_TO_TWO_HUNDRED;
        return SquatCapacityRange.ONE_TO_THIRTY; // Default değer
    }

    static getPlankDurationRange(plankDuration: number): number {
        if (plankDuration >= 15 && plankDuration <= 45) return PlankDurationRange.FIFTEEN_TO_FORTY_FIVE;
        if (plankDuration >= 46 && plankDuration <= 75) return PlankDurationRange.FORTY_SIX_TO_SEVENTY_FIVE;
        if (plankDuration >= 76 && plankDuration <= 105) return PlankDurationRange.SEVENTY_SIX_TO_ONE_HUNDRED_FIVE;
        if (plankDuration >= 106 && plankDuration <= 135) return PlankDurationRange.ONE_HUNDRED_SIX_TO_ONE_THIRTY_FIVE;
        if (plankDuration >= 136 && plankDuration <= 165) return PlankDurationRange.ONE_THIRTY_SIX_TO_ONE_SIXTY_FIVE;
        if (plankDuration >= 166 && plankDuration <= 195) return PlankDurationRange.ONE_SIXTY_SIX_TO_ONE_NINETY_FIVE;
        if (plankDuration >= 196 && plankDuration <= 225) return PlankDurationRange.ONE_NINETY_SIX_TO_TWO_TWENTY_FIVE;
        if (plankDuration >= 226 && plankDuration <= 255) return PlankDurationRange.TWO_TWENTY_SIX_TO_TWO_FIFTY_FIVE;
        if (plankDuration >= 256 && plankDuration <= 285) return PlankDurationRange.TWO_FIFTY_SIX_TO_TWO_EIGHTY_FIVE;
        if (plankDuration >= 286 && plankDuration <= 315) return PlankDurationRange.TWO_EIGHTY_SIX_TO_THREE_FIFTEEN;
        if (plankDuration >= 316 && plankDuration <= 345) return PlankDurationRange.THREE_SIXTEEN_TO_THREE_FORTY_FIVE;
        if (plankDuration >= 346 && plankDuration <= 375) return PlankDurationRange.THREE_FORTY_SIX_TO_THREE_SEVENTY_FIVE;
        if (plankDuration >= 376 && plankDuration <= 405) return PlankDurationRange.THREE_SEVENTY_SIX_TO_FOUR_HUNDRED_FIVE;
        if (plankDuration >= 406 && plankDuration <= 435) return PlankDurationRange.FOUR_HUNDRED_SIX_TO_FOUR_THIRTY_FIVE;
        if (plankDuration >= 436 && plankDuration <= 465) return PlankDurationRange.FOUR_THIRTY_SIX_TO_FOUR_SIXTY_FIVE;
        if (plankDuration >= 466 && plankDuration <= 495) return PlankDurationRange.FOUR_SIXTY_SIX_TO_FOUR_NINETY_FIVE;
        if (plankDuration >= 496 && plankDuration <= 525) return PlankDurationRange.FOUR_NINETY_SIX_TO_FIVE_TWENTY_FIVE;
        if (plankDuration >= 526 && plankDuration <= 555) return PlankDurationRange.FIVE_TWENTY_SIX_TO_FIVE_FIFTY_FIVE;
        if (plankDuration >= 556 && plankDuration <= 585) return PlankDurationRange.FIVE_FIFTY_SIX_TO_FIVE_EIGHTY_FIVE;
        if (plankDuration >= 586 && plankDuration <= 600) return PlankDurationRange.FIVE_EIGHTY_SIX_TO_SIX_HUNDRED;
        return PlankDurationRange.FIFTEEN_TO_FORTY_FIVE; // Default değer
    }

    static getDailyWalkingDurationRange(dailyWalkingDuration: number): number {
        if (dailyWalkingDuration >= 1 && dailyWalkingDuration <= 30) return DailyWalkingDurationRange.ONE_TO_THIRTY;
        if (dailyWalkingDuration >= 31 && dailyWalkingDuration <= 60) return DailyWalkingDurationRange.THIRTYONE_TO_SIXTY;
        if (dailyWalkingDuration >= 61 && dailyWalkingDuration <= 90) return DailyWalkingDurationRange.SIXTYONE_TO_NINETY;
        if (dailyWalkingDuration >= 91 && dailyWalkingDuration <= 120) return DailyWalkingDurationRange.NINETYONE_TO_ONE_TWENTY;
        return DailyWalkingDurationRange.ONE_TO_THIRTY; // Default değer
    }
}
