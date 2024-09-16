import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const getProducts = createAsyncThunk('product/getProducts', async ({ search, currentPage, priceRange,brand, category, ratingsfilter, sortbyPrice, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (priceRange) {
            query += `price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}&`;
        }
        if (category.length > 0) {
            query += `category=${category.join(',')}&`; 
        }
        if (brand.length>0) {
            query += `brand=${brand.join(',')}&`; 

        }
        if (ratingsfilter) query += `ratings[gte]=${ratingsfilter}&`;
        if (sortbyPrice) query += `sortbyPrice=${sortbyPrice}&`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/products?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});



export const addProduct = createAsyncThunk('product/addProduct', async ({ formData, toast }, { rejectWithValue }) => {

    try {
        const { data } = await axiosPrivate.post(`/products`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã thêm sản phẩm mới thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getProductsByAuthorizeRoles = createAsyncThunk('product/getProductsByAuthorizeRoles', async ({ search, currentPage, startDate, endDate, status, category, brand, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;
        if (category) query += `category=${category}&`;
        if (brand) query += `brand=${brand}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        console.log(query)
        const { data } = await axiosPrivate.get(`/athorized/products?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteProduct = createAsyncThunk('product/deleteProduct', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/products/${id}`);
        toast.success('Đã xóa sản phẩm  thành công .');

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const deleteProductImg = createAsyncThunk('product/deleteProductImg', async ({ id, imageId, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/products/${id}/image/${imageId}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const productDetails = createAsyncThunk('product/productDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/products/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateProduct = createAsyncThunk('product/updateProduct', async ({ id, formData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/products/${id}`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã cập nhật sản phẩm  thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const productSlice = createSlice({
    name: 'product',
    initialState: {
        mutationResult: { success: false },
        productlist: { products: [] },
        productDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        },
        resetProducts: (state) => {
            state.productlist.products = [];
        }
    },
    extraReducers: {
        // get all product list fro all
        [getProducts.pending]: (state, action) => {
            state.productlist.loading = true;

        },
        [getProducts.fulfilled]: (state, action) => {
            state.productlist.loading = false;
            state.productlist.products = [...state.productlist.products, ...action.payload.products];
            state.productlist.productCount = action.payload.productCount;
            state.productlist.resultPerPage = action.payload.resultPerPage;
            state.productlist.price=action.payload.price;;
            state.productlist.filteredProductsCount = action.payload.filteredProductsCount;
        },
        [getProducts.rejected]: (state, action) => {
            state.productlist.loading = false;
            state.productlist.error = action.payload;
        },
        //add new product
        [addProduct.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addProduct.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addProduct.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        // get all product list
        [getProductsByAuthorizeRoles.pending]: (state, action) => {
            state.productlist.loading = true;
        },
        [getProductsByAuthorizeRoles.fulfilled]: (state, action) => {
            state.productlist.loading = false;
            state.productlist.products = action.payload.products;
            state.productlist.stock = action.payload.stock;
            state.productlist.productCount = action.payload.productCount;
            state.productlist.resultPerPage = action.payload.resultPerPage;
            state.productlist.filteredProductsCount = action.payload.filteredProductsCount;
        },
        [getProductsByAuthorizeRoles.rejected]: (state, action) => {
            state.productlist.loading = false;
            state.productlist.error = action.payload;
        },
        //delete a product
        [deleteProduct.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteProduct.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteProduct.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [deleteProductImg.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteProductImg.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteProductImg.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        //get product details
        [productDetails.pending]: (state, action) => {
            state.productDetails.loading = true;
        },
        [productDetails.fulfilled]: (state, action) => {
            state.productDetails.loading = false;
            state.productDetails.product = action.payload.product;
        },
        [productDetails.rejected]: (state, action) => {
            state.productDetails.loading = false;
            state.productDetails.error = action.payload;
        },
        //update product
        [updateProduct.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateProduct.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateProduct.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
    }
})

export const selectProductMutationResult = (state) => state.product.mutationResult;
export const selectAllProducts = (state) => state.product.productlist;
export const selectProductDetails = (state) => state.product.productDetails;
export const { resetMutationResult, resetProducts } = productSlice.actions;

export default productSlice.reducer;