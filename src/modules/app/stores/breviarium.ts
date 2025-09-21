import {defineStore} from "pinia";

import Breviarium from "breviarium";
import {useDateStore} from "@/modules/app/stores/useDateStore.ts";
import {
    CompletoriumSchemaOutput,
    EvangeliumSchemaOutput,
    IntermediateSchemaOutput,
    InvitatoriumSchemaOutput,
    LaudesSchemaOutput,
    LecturesSchemaOutput,
    LiturgyInformationOutput,
    OfficiumSchemaOutput,
    VesperaeSchemaOutput
} from "breviarium/dist/prayer-manager-interface";

export const useBreviariumStore = defineStore("breviarium", () => {
    const breviarium = new Breviarium(useDateStore().getCurrentDate);

    const setBreviariumDate = (date: Date): void => {
        breviarium.setDate(date);
    }

    const getInvitatorium = async (date?: Date): Promise<InvitatoriumSchemaOutput | undefined> => {
        return await breviarium.getInvitatorium(date || useDateStore().getCurrentDate);
    }

    const getLectures = async (date?: Date): Promise<LecturesSchemaOutput[] | undefined> => {
        return await breviarium.getLectures(date || useDateStore().getCurrentDate);
    }

    const getLaudes = async (date?: Date): Promise<LaudesSchemaOutput[] | undefined> => {
        return await breviarium.getLaudes(date || useDateStore().getCurrentDate);
    }

    const getVesperae = async (date?: Date): Promise<VesperaeSchemaOutput[] | undefined> => {
        return await breviarium.getVesperae(date || useDateStore().getCurrentDate);
    }

    const getOfficium = async (date?: Date): Promise<OfficiumSchemaOutput | undefined> => {
        return await breviarium.getOfficium(date || useDateStore().getCurrentDate);
    }

    const getTertia = async (date?: Date): Promise<IntermediateSchemaOutput | undefined> => {
        return await breviarium.getTertia(date || useDateStore().getCurrentDate);
    }

    const getSexta = async (date?: Date): Promise<IntermediateSchemaOutput | undefined> => {
        return await breviarium.getSexta(date || useDateStore().getCurrentDate);
    }

    const getNona = async (date?: Date): Promise<IntermediateSchemaOutput | undefined> => {
        return await breviarium.getNona(date || useDateStore().getCurrentDate);
    }

    const getCompletorium = async (date?: Date): Promise<CompletoriumSchemaOutput | undefined> => {
        return await breviarium.getCompletorium(date || useDateStore().getCurrentDate);
    }

    const getEvangelium = async (date?: Date): Promise<EvangeliumSchemaOutput | undefined> => {
        return await breviarium.getEvangelium(date || useDateStore().getCurrentDate);
    }

    const getInvitatoriumPsalms = async (): Promise<any[]> => {
        return await breviarium.getInvitatoriumPsalms();
    }

    const getLiturgyInformation = async (date?: Date): Promise<LiturgyInformationOutput> => {
        return await breviarium.getLiturgyInformation(date || useDateStore().getCurrentDate);
    }

    return {
        breviarium,
        setBreviariumDate,
        getInvitatorium,
        getLectures,
        getLaudes,
        getVesperae,
        getOfficium,
        getTertia,
        getSexta,
        getNona,
        getCompletorium,
        getEvangelium,
        getInvitatoriumPsalms,
        getLiturgyInformation,
    };
});