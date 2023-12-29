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


import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { useReducer } from 'react';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    auth: AuthReducer,
    brand: BrandReducer,
    category: CategoryReducer,
    banner: bannerSlice,
    product: ProductReducer,
    cart: CartReducer,
    review: ReviewReducer,
    shipping: ShippingReducer,
    order: OrderReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER]
        }
    })
})

export let Persistor = persistStore(store)