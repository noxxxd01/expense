import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signin`,
        method: "POST",
        body: data,
      }),
    }),

    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),

    signout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/signout`,
        method: "POST",
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    delete: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/delete-user`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useProfileMutation,
  useDeleteMutation,
} = userApiSlice;
