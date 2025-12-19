import api from "../lib/api.ts";
import type {PeopleResponseType, PeopleRequestType} from "../features/people/people.types.ts";

export const PeopleService = {
  createPeople: async (
    token: string,
    people: PeopleRequestType
  ): Promise<PeopleResponseType> => {
    const response = await api.post<PeopleResponseType>(`/people`, people, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAllPeople: async (token: string): Promise<PeopleResponseType[]> => {
    const response = await api.get<PeopleResponseType[]>(`/people`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getPeopleById: async (
    token: string,
    peopleId: string
  ): Promise<PeopleResponseType> => {
    const response = await api.get<PeopleResponseType>(`/people/${peopleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updatePeople: async (
    token: string,
    peropleId: string,
    people: PeopleRequestType
  ): Promise<PeopleResponseType> => {
    const response = await api.put<PeopleResponseType>(
      `/people/${peropleId}`,
      people,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deletePeople: async (token: string, peropleId: string): Promise<any> => {
    const response = await api.delete<any>(`/people/${peropleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
