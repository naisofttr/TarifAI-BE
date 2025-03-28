import { exerciseExperienceType } from "../../enums/exerciseExperienceType";
import { genderType } from "../../enums/genderType";
import { badHabitsType } from "../../enums/profileEnums/badHabitsType";
import { bodyType } from "../../enums/profileEnums/bodyType";
import { commitmentDurationType } from "../../enums/profileEnums/commitmentDurationType";
import { energyLevelType } from "../../enums/profileEnums/energyLevelType";
import { focusAreaType } from "../../enums/profileEnums/focusAreaType";
import { formType } from "../../enums/profileEnums/formType";
import { howOftenExercise } from "../../enums/profileEnums/howOftenExercise";
import { motivationLevelType } from "../../enums/profileEnums/motivationLevelType";
import { motivationSourceType } from "../../enums/profileEnums/motivationSourceType";
import { preferredPaceType } from "../../enums/profileEnums/preferredPaceType";
import { pushUpCapacityType } from "../../enums/profileEnums/pushUpCapacityType";
import { sleepDurationType } from "../../enums/profileEnums/sleepDurationType";
import { stressFrequencyType } from "../../enums/profileEnums/stressFrequencyType";
import { targetType } from "../../enums/profileEnums/targetType";
import { trainingDayType } from "../../enums/profileEnums/trainingDayType";

export interface CustomerProfileDto {
    gender: genderType;                                  // cinsiyet
    targetType: targetType;                              // hedef
    bodyType: bodyType;                                  // vücut tipi
    focusAreaType: focusAreaType[];                      // bölge secimi
    exerciseExperienceType: exerciseExperienceType;     // sıklık
    formType: formType;

    age: number;                                        // Yaş(13-60)
    height: number;                                     // boy (150cm-210cm)
    weight: number;                                     // kg(40kg-200kg)

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

    hasSoundRestriction: boolean;                       // ses kısıtlaması var mı?
    weekNumber: number;                                 // programın kaçıncı haftası
}
