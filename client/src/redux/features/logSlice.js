import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosPrivate from '../axiosPrivate'; 

export const getLogs = createAsyncThunk('log/getLogs', async({ search, currentPage, startDate, endDate, action, entityType, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (action) query += `action=${action}&`;
        if (entityType) query += `entityType=${entityType}&`;
        
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/checklog?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});

export const getNotificationsLogs = createAsyncThunk('log/getNotificationsLogs', async({ search, currentPage, startDate, endDate, action, entityType, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (action) query += `action=${action}&`;
        if (entityType) query += `entityType=${entityType}&`;
        
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/checklog?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});
export const getLogDetails = createAsyncThunk('log/getLogDetails', async({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.get(`/checklog/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});

const logSlice = createSlice({
    name: 'log',
    initialState: {
        mutationResult: { success: false },
        loglist: { logs: [] },
        logDetails: {},
        Notifications:{logs:[]}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        },
        resetLogs: (state) => {
            state.loglist.logs = [];
        }
    },
    extraReducers: {
        [getLogs.pending]: (state) => {
            state.loglist.loading = true;
        },
        [getLogs.fulfilled]: (state, action) => {
            state.loglist.loading = false;
            state.loglist.logs = action.payload.logs;
            state.loglist.logCount = action.payload.logCount;
            state.loglist.resultPerPage = action.payload.resultPerPage;
            state.loglist.filteredLogsCount = action.payload.filteredLogsCount;
        },
        [getLogs.rejected]: (state, action) => {
            state.loglist.loading = false;
            state.loglist.error = action.payload;
        },
        [getLogDetails.pending]: (state) => {
            state.logDetails.loading = true;
        },
        [getLogDetails.fulfilled]: (state, action) => {
            state.logDetails.loading = false;
            state.logDetails.log = action.payload.log;
        },
        [getLogDetails.rejected]: (state, action) => {
            state.logDetails.loading = false;
            state.logDetails.error = action.payload;
        },
        [getNotificationsLogs.pending]: (state) => {
            state.Notifications.loading = true;
        },
        [getNotificationsLogs.fulfilled]: (state, action) => {
            state.Notifications.loading = false;
            state.Notifications.logs = action.payload.logs;
            state.Notifications.logCount = action.payload.logCount;
            state.Notifications.resultPerPage = action.payload.resultPerPage;
            state.Notifications.filteredLogsCount = action.payload.filteredLogsCount;
        },
        [getNotificationsLogs.rejected]: (state, action) => {
            state.Notifications.loading = false;
            state.Notifications.error = action.payload;
        },
    }
});

export const selectLogMutationResult = (state) => state.log.mutationResult;
export const selectAllLogs = (state) => state.log.loglist;
export const selectNotificationsLogs = (state) => state.log.Notifications;

export const selectLogDetails = (state) => state.log.logDetails;
export const { resetMutationResult, resetLogs } = logSlice.actions;

export default logSlice.reducer;
