import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Arr = {
  __typename?: 'ARR';
  time: Scalars['String'];
  id: Scalars['Float'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  addUser: UserResponse;
  logout: Scalars['Boolean'];
  updateUser: UserResponse;
  addSlot: Slot;
  deleteBooking: Scalars['Boolean'];
  bookSlot: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  options: UserLogin;
};


export type MutationAddUserArgs = {
  options: UserInput;
};


export type MutationUpdateUserArgs = {
  vehicles: Scalars['String'];
  mobileno: Scalars['Float'];
};


export type MutationDeleteBookingArgs = {
  n: Scalars['Float'];
  id: Scalars['Float'];
};


export type MutationBookSlotArgs = {
  n: Scalars['Float'];
  id: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  getUsers: Array<User>;
  me?: Maybe<User>;
  getUser?: Maybe<User>;
  getSlots: Array<Slot>;
  getUserSlots?: Maybe<Array<Arr>>;
};


export type QueryGetUserArgs = {
  id: Scalars['Float'];
};

export type Slot = {
  __typename?: 'Slot';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  timings: Array<SlotTimings>;
};

export type SlotTimings = {
  __typename?: 'SlotTimings';
  time: Scalars['String'];
  bookedby?: Maybe<Scalars['Float']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  mobileno?: Maybe<Scalars['Float']>;
  vehicles?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type UserLogin = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type RegUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type RegUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & RegUserFragment
  )> }
);

export type BookSlotMutationVariables = Exact<{
  id: Scalars['Float'];
  n: Scalars['Float'];
}>;


export type BookSlotMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'bookSlot'>
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegUserResponseFragment
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  options: UserLogin;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UserInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { addUser: (
    { __typename?: 'UserResponse' }
    & RegUserResponseFragment
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  vehicles: Scalars['String'];
  mobileno: Scalars['Float'];
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'UserResponse' }
    & RegUserResponseFragment
  ) }
);

export type GetSlotsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSlotsQuery = (
  { __typename?: 'Query' }
  & { getSlots: Array<(
    { __typename?: 'Slot' }
    & Pick<Slot, 'id' | 'createdAt' | 'updatedAt'>
    & { timings: Array<(
      { __typename?: 'SlotTimings' }
      & Pick<SlotTimings, 'time' | 'bookedby'>
    )> }
  )> }
);

export type GetUserQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'mobileno' | 'vehicles'>
  )> }
);

export type GetUserSlotsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSlotsQuery = (
  { __typename?: 'Query' }
  & { getUserSlots?: Maybe<Array<(
    { __typename?: 'ARR' }
    & Pick<Arr, 'id' | 'time'>
  )>> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegUserFragment
  )> }
);

export const RegErrorFragmentDoc = gql`
    fragment RegError on FieldError {
  field
  message
}
    `;
export const RegUserFragmentDoc = gql`
    fragment RegUser on User {
  id
  username
}
    `;
export const RegUserResponseFragmentDoc = gql`
    fragment RegUserResponse on UserResponse {
  errors {
    ...RegError
  }
  user {
    ...RegUser
  }
}
    ${RegErrorFragmentDoc}
${RegUserFragmentDoc}`;
export const BookSlotDocument = gql`
    mutation bookSlot($id: Float!, $n: Float!) {
  bookSlot(id: $id, n: $n)
}
    `;

export function useBookSlotMutation() {
  return Urql.useMutation<BookSlotMutation, BookSlotMutationVariables>(BookSlotDocument);
};
export const ChangePasswordDocument = gql`
    mutation changePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegUserResponse
  }
}
    ${RegUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($options: UserLogin!) {
  login(options: $options) {
    ...RegUserResponse
  }
}
    ${RegUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UserInput!) {
  addUser(options: $options) {
    ...RegUserResponse
  }
}
    ${RegUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateUserDocument = gql`
    mutation updateUser($vehicles: String!, $mobileno: Float!) {
  updateUser(vehicles: $vehicles, mobileno: $mobileno) {
    ...RegUserResponse
  }
}
    ${RegUserResponseFragmentDoc}`;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
};
export const GetSlotsDocument = gql`
    query getSlots {
  getSlots {
    id
    createdAt
    updatedAt
    timings {
      time
      bookedby
    }
  }
}
    `;

export function useGetSlotsQuery(options: Omit<Urql.UseQueryArgs<GetSlotsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetSlotsQuery>({ query: GetSlotsDocument, ...options });
};
export const GetUserDocument = gql`
    query getUser($id: Float!) {
  getUser(id: $id) {
    id
    username
    email
    mobileno
    vehicles
  }
}
    `;

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
};
export const GetUserSlotsDocument = gql`
    query getUserSlots {
  getUserSlots {
    id
    time
  }
}
    `;

export function useGetUserSlotsQuery(options: Omit<Urql.UseQueryArgs<GetUserSlotsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserSlotsQuery>({ query: GetUserSlotsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegUser
  }
}
    ${RegUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};