import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';
import { toast } from 'react-toastify';

export const registration = createAsyncThunk('auth/registration', async ({ formData, toast }, { rejectWithValue }) => {
    try {

        const { data } = await axiosPublic.post(`/register`, formData,);
        toast.success('Đăng ký thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const login = createAsyncThunk('auth/login', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.post(`/login`, jsonData);
        toast.success('Đã đăng nhập thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.post(`/forgotPassword`, jsonData);
        toast.success('Đã quên mật khẩu thành công. Vui lòng kiểm tra email quên mật khẩu.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.post(`/resetPassword`, jsonData);
        toast.success('Đặt lại mật khẩu thành công. ');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const LoginGoogle = createAsyncThunk('auth/loginGoogle', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.post(`/auth/googleLogin`, jsonData);
        toast.success('Đã đăng nhập thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const logout = createAsyncThunk('auth/logout', async ({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.post(`/logout`);
        toast.success('Đã đăng xuất thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const changePassword = createAsyncThunk('auth/changePassword', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/password/update`, jsonData);
        toast.success('Mật khẩu đã được thay đổi.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ formData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/me/update`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Cập nhật thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const getAllUsers = createAsyncThunk('auth/getAllUsers', async ({ search, currentPage, startDate, endDate, blocked, role, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (blocked) query += `blocked=${blocked}&`;
        if (role) query += `roles=${role}&`
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`users?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteUser = createAsyncThunk('auth/deleteUser', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`users/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getUserDetails = createAsyncThunk('auth/getUserDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.get(`users/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateUserRole = createAsyncThunk('auth/updateUserRole', async ({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`users/${id}`, jsonData);
        toast.success('Đã Cập Nhật.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        mutationResult: { success: false },
        credentials: {},
        userlist: { users: [] },
        userDetails: { user: {} },
        persist: JSON.parse(localStorage.getItem('persist')) || false,
    },
    reducers: {
        persistLogin: (state, action) => {
            state.persist = action.payload;
            localStorage.setItem('persist', action.payload);
        },
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        },
        refreshUserDetails: (state, action) => {
            state.credentials.accessToken = action.payload.accessToken;
            state.credentials.user = action.payload.user;
        }
    },
    extraReducers: {
        //registration
        [registration.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [registration.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;

        },
        [registration.rejected]: (state, action) => {
            state.mutationResult.loading = false;
        },
        //login
        [login.pending]: (state, action) => {
            state.credentials.loading = true;
        },
        [login.fulfilled]: (state, action) => {
            state.credentials.loading = false;
            state.credentials.accessToken = action.payload.accessToken;
            state.credentials.user = action.payload.user;
        },
        [login.rejected]: (state, action) => {
            state.credentials.loading = false;
            state.credentials.error = action.payload;
        },
        //
        //login
        [LoginGoogle.pending]: (state, action) => {
            state.credentials.loading = true;
        },
        [LoginGoogle.fulfilled]: (state, action) => {
            state.credentials.loading = false;
            state.credentials.accessToken = action.payload.accessToken;
            state.credentials.user = action.payload.user;
        },
        [LoginGoogle.rejected]: (state, action) => {
            state.credentials.loading = false;
            state.credentials.error = action.payload;
        },
        //logout
        [logout.pending]: (state, action) => {
            state.credentials.loading = true;
        },
        [logout.fulfilled]: (state, action) => {
            state.credentials = {};
            state.persist = false;
            localStorage.setItem('persist', false);
        },
        [logout.rejected]: (state, action) => {
            state.credentials.loading = false;
            state.credentials.error = action.payload;
        },
        // change password
        [changePassword.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [changePassword.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;

        },
        [changePassword.rejected]: (state, action) => {
            state.mutationResult.loading = false;
        },

        //update profile
        [updateProfile.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateProfile.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;

            state.credentials.user = action.payload.user;
        },
        [updateProfile.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.credentials.error = action.payload;
        },

        //get all user list
        [getAllUsers.pending]: (state, action) => {
            state.userlist.loading = true;
        },
        [getAllUsers.fulfilled]: (state, action) => {
            state.userlist.loading = false;
            state.userlist.users = action.payload.users;
            state.userlist.userCount = action.payload.userCount;
            state.userlist.resultPerPage = action.payload.resultPerPage;
            state.userlist.filteredUsersCount = action.payload.filteredUsersCount;
        },
        [getAllUsers.rejected]: (state, action) => {
            state.userlist.loading = false;
            state.userlist.error = action.payload;
        },

        // delete an user
        [deleteUser.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteUser.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteUser.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.credentials.error = action.payload;
        },
        //get a single user details
        [getUserDetails.pending]: (state, action) => {
            state.userDetails.loading = true;
        },
        [getUserDetails.fulfilled]: (state, action) => {
            state.userDetails.loading = false;
            state.userDetails.user = action.payload.user;
        },
        [getUserDetails.rejected]: (state, action) => {
            state.userDetails.loading = false;
            state.userDetails.error = action.payload;
        },
        // update role 
        [updateUserRole.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateUserRole.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateUserRole.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.credentials.error = action.payload;
        },
    }
})
export const selectMutationResult = (state) => state.auth.mutationResult;
export const selectLoggedInUser = (state) => state.auth.credentials;
export const selectUserList = (state) => state.auth.userlist;
export const selectUserDetails = (state) => state.auth.userDetails;

export const selectPersist = (state) => state.auth;

export const { resetMutationResult, refreshUserDetails, persistLogin } = authSlice.actions;

export default authSlice.reducer;