import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const addBlog = createAsyncThunk('blog/addBlog', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post(`/blogs`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã thêm tin mới thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getBlogs = createAsyncThunk('blog/getBlogs', async ({ search, currentPage, startDate, endDate, status, category, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;
        if (category) query += `blogCategory=${category}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;

        const { data } = await axiosPublic.get(`/blogs?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getBlogsAuthorizeRole = createAsyncThunk('blog/getBlogsAuthorizeRole', async ({ search, currentPage, startDate, endDate, status, category, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;
        if (category) query += `blogCategory=${category}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/athorized/blogs?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const deleteBlog = createAsyncThunk('blog/deleteBlog', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/blogs/${id}`);
        toast.success('Đã xóa tin thành công .');

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const blogsDetails = createAsyncThunk('blog/blogDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/blogs/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateBlog = createAsyncThunk('blog/updateBlog', async ({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/blogs/${id}`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã cập nhật tin thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        mutationResult: { success: false },
        bloglist: { blogs: [] },
        blogDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        },
        resetBlogs: (state) => {
            state.bloglist.blogs = [];
        }
    },
    extraReducers: {
        //add new category
        [addBlog.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addBlog.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addBlog.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        // get all category list
        [getBlogs.pending]: (state, action) => {
            state.bloglist.loading = true;
        },
        [getBlogs.fulfilled]: (state, action) => {
            state.bloglist.loading = false;
            state.bloglist.blogs = [...state.bloglist.blogs, ...action.payload.blogs];
            state.bloglist.blogCount = action.payload.blogCount;
            state.bloglist.resultPerPage = action.payload.resultPerPage;
            state.bloglist.filteredBlogsCount = action.payload.filteredBlogsCount;
        },
        [getBlogs.rejected]: (state, action) => {
            state.bloglist.loading = false;
            state.bloglist.error = action.payload;
        },
        [getBlogsAuthorizeRole.pending]: (state, action) => {
            state.bloglist.loading = true;
        },
        [getBlogsAuthorizeRole.fulfilled]: (state, action) => {
            state.bloglist.loading = false;
            state.bloglist.blogs = action.payload.blogs;
            state.bloglist.blogCount = action.payload.blogCount;
            state.bloglist.resultPerPage = action.payload.resultPerPage;
            state.bloglist.filteredBlogsCount = action.payload.filteredBlogsCount;
        },
        [getBlogsAuthorizeRole.rejected]: (state, action) => {
            state.bloglist.loading = false;
            state.bloglist.error = action.payload;
        },
        [deleteBlog.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteBlog.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteBlog.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [blogsDetails.pending]: (state, action) => {
            state.blogDetails.loading = true;
        },
        [blogsDetails.fulfilled]: (state, action) => {
            state.blogDetails.loading = false;
            state.blogDetails.blog = action.payload.blog;
        },
        [blogsDetails.rejected]: (state, action) => {
            state.blogDetails.loading = false;
            state.blogDetails.error = action.payload;
        },
        [updateBlog.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateBlog.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateBlog.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
    }
})

export const selectBlogMutationResult = (state) => state.blog.mutationResult;
export const selectAllBlog = (state) => state.blog.bloglist;
export const selectBlogDetails = (state) => state.blog.blogDetails;
export const { resetMutationResult, resetBlogs } = blogSlice.actions;

export default blogSlice.reducer;