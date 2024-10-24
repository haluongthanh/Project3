import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import AuthReducer from './redux/features/authSlice';
import BrandReducer from './redux/features/brandSlice';
import CategoryReducer from './redux/features/categorySlice';
import bannerSlice from './redux/features/bannerSlice';
import ProductReducer from './redux/features/productSlice';
import CartReducer from './redux/features/cartSlice';
import ReviewReducer from './redux/features/reviewSlice';
import ShippingReducer from './redux/features/shippingSlice';
import OrderReducer from './redux/features/orderSlice';
import blogReducer from './redux/features/blogSlice';
import blogVCategoryReducer from './redux/features/blogCategorySlice';
import websiteReducer from './redux/features/websiteSlice'
import logReducer from './redux/features/logSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { useReducer } from 'react';
import { encryptTransform } from 'redux-persist-transform-encrypt';

const secretKey = 'my-super-secret-key'; 


const encryptor = encryptTransform({
    secretKey,
    onError: function (error) {
        // Handle the error here
        console.error('Encryption error:', error);
    },
});
//oj
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    transforms: [encryptor], 
}
const shippingConfig = {
    key: 'shippng',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, AuthReducer),
    brand: BrandReducer,
    category: CategoryReducer,
    banner: bannerSlice,
    product: ProductReducer,
    cart: CartReducer,
    review: ReviewReducer,
    shipping:  persistReducer(shippingConfig, ShippingReducer),
    order: OrderReducer,
    blog: blogReducer,
    blogCategory: blogVCategoryReducer,
    web: websiteReducer,
    log:logReducer
})

//save all reducer in local storage
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER]
        }
    })
})

export let Persistor = persistStore(store)