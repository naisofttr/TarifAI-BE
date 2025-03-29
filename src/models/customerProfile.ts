import { CustomerProfileDto } from "../dtos/CustomerProfile/customerProfileDto";
import { genderType } from "../enums/genderType";
import { badHabitsType } from "../enums/profileEnums/badHabitsType";
import { bodyType } from "../enums/profileEnums/bodyType";
import { commitmentDurationType } from "../enums/profileEnums/commitmentDurationType";
import { energyLevelType } from "../enums/profileEnums/energyLevelType";
import { focusAreaType } from "../enums/profileEnums/focusAreaType";
import { formType } from "../enums/profileEnums/formType";
import { howOftenExercise } from "../enums/profileEnums/howOftenExercise";
import { motivationLevelType } from "../enums/profileEnums/motivationLevelType";
import { motivationSourceType } from "../enums/profileEnums/motivationSourceType";
import { preferredPaceType } from "../enums/profileEnums/preferredPaceType";
import { pushUpCapacityType } from "../enums/profileEnums/pushUpCapacityType";
import { sleepDurationType } from "../enums/profileEnums/sleepDurationType";
import { stressFrequencyType } from "../enums/profileEnums/stressFrequencyType";
import { targetType } from "../enums/profileEnums/targetType";
import { trainingDayType } from "../enums/profileEnums/trainingDayType";


export interface CustomerProfile extends CustomerProfileDto {
    id: string;
}

export interface CreatedCustomerProfileResponse {
    success: boolean;
    data?: CustomerProfileDto;
    errorMessage?: string;
}