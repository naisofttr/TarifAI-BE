import { CustomerProfileDto } from "../dtos/CustomerProfile/customerProfileDto";
import { exerciseExperienceType } from "../enums/exerciseExperienceType";
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


export interface CustomerProfile {
    id: string;
    customerId: string;
    
    gender: genderType;                                  // cinsiyet
    targetType: targetType;                              // hedef
    bodyType: bodyType;                                  // vücut tipi
    focusAreaType: focusAreaType[];                      // bölge secimi
    exerciseExperienceType: exerciseExperienceType;         // sıklık
    formType: formType;

    age: number;                                        // Yaş
    height: number;                                     // boy (cm)
    weight: number;                                     // kg

    howOftenExercise: howOftenExercise;                 // ne sıkılıkta spor yapabilirsin.
    pushUpCapacity: pushUpCapacityType;                 // şınav çekebilme
    badHabits: badHabitsType[];                         // kötü alışkanlıklar
    dailySleepDuration: sleepDurationType;              // günlük uyku süresi
    stressFrequency: stressFrequencyType;                // stres seviyesi
    motivationSources: motivationSourceType[];           // motivasyon kaynağı
    motivationLevel: motivationLevelType;                // motivasyon seviyesi
    commitmentDuration: commitmentDurationType;          // taahhüt süresi
    preferredPace: preferredPaceType;                    // tercih edilen tempo
    energyLevel: energyLevelType;                        // enerji seviyesi
    trainingDays: trainingDayType[];                     // antrenman günleri
    exerciseEquipments: string[];                       // egzersiz ekipmanları (dumbell, barfiks demiri vs.)
    hasKneePain: boolean;                               // diz ağrısı çekiyor musun?
    kneePainLevel: number;                              // diz ağrısı seviyesi (1-10)
    squatCapacity: number;                              // kaç tane çömelme yapabilirsin (1-200)
    plankDuration: number;                              // plankte kalabilme süresi (15sn - 600sn)
    dailyWalkingDuration: number;                       // günlük yürüme süresi (1dk - 120dk)
    weekNumber: number;                                 // programın kaçıncı haftası
    hasSoundRestriction: boolean;                       // ses kısıtlaması var mı?
    
    createdAt?: string;
    updatedAt?: string;
}
export interface CreatedCustomerProfileResponse {
    success: boolean;
    data?: CustomerProfileDto;
    errorMessage?: string;
    combinationId?: string;
}