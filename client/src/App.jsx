import React from 'react';
import { Route, Routes } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notfound from './images/notfound.svg';
import BoxShadowLoader from './components/Skeletons/BoxShadowLoader';
import { axiosPublic } from './redux/axiosPublic';
import { selectLoggedInUser, selectPersist, refreshUserDetails } from './redux/features/authSlice';
import AuthorizedRoute from './components/Routes/AuthorizedRoute';
import AuthenticatedRoute from './components/Routes/AuthenticatedRoute';
import MainLayout from './components/Layout/MainLayout';

import Blog from './components/Pages/Blog';
import BlogDetails from './components/Pages/BlogDetails';
import Auth from './components/Auth/Auth';
import UserProfile from './components/Auth/UserProfile';
import UpdateProfile from './components/Auth/UpdateProfile';
import UpdatePassword from './components/Auth/UpdatePassword';
import Dashboard from './components/Authorized/Dashboard/Dashboard';
import AddNewBrand from './components/Authorized/Brand/AddNewBrand';
import BrandList from './components/Authorized/Brand/BrandList';
import UpdateBrand from './components/Authorized/Brand/UpdateBrand';
import AddNewBanner from './components/Authorized/Banner/AddNewBanner';
import BannerList from './components/Authorized/Banner/BannerList';
import UpdateBanner from './components/Authorized/Banner/UpdateBanner';
import AddNewCategory from './components/Authorized/Category/AddNewCategory';
import CategoryList from './components/Authorized/Category/CategoryList';
import UpdateCategory from './components/Authorized/Category/UpdateCategory';
import AddNewBlogCategory from './components/Authorized/BlogCategory/AddNewBlogCategory';
import BlogCategoryList from './components/Authorized/BlogCategory/BlogCategoryList';
import UpdateBlogCategory from './components/Authorized/BlogCategory/UpdateBlogCategory';
import AddNewBlog from './components/Authorized/Blog/AddNewBlog';
import BlogList from './components/Authorized/Blog/BlogList';
import UpdateBlog from './components/Authorized/Blog/UpdateBlog';
import AddNewProduct from './components/Authorized/Product/AddNewProduct';
import ProductList from './components/Authorized/Product/ProductList';
import UpdateProduct from './components/Authorized/Product/UpdateProduct';
import OrderList from './components/Authorized/Order/OrderList';
import ProcessOrder from './components/Authorized/Order/ProcessOrder';
import ReviewList from './components/Authorized/Review/ReviewList';
import UserList from './components/Authorized/User/UserList';
import UpdateRole from './components/Authorized/User/UpdateRole';
import LogList from './components/Authorized/Log/loglist';
import LogDetails from './components/Authorized/Log/logDetails';
import Home from './components/Home/Home';
import Products from './components/Product/Products';
import ProductDetails from './components/Product/ProductDetails';
import Cart from './components/Cart/Cart';
import Shipping from './components/Shipping/Shipping';
import ConfirmOrder from './components/ConfirmOrder/ConfirmOrder';
import OrderSuccess from './components/Payment/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Unauthorized from './components/Error/Unauthorized';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import ResetPassword from './components/Auth/Resetpassword';
import ForgotPassword from './components/Auth/Forgotpassword';
import LoginSuccess from './components/Auth/LoginSuccess';
import withRole from './utility/withRole';
import Website from './components/Authorized/Website/Website'
import './App.css'

// Protected routes
const ProtectedWebsite=withRole(Website,['admin'])

const ProtectedOrderList = withRole(OrderList, ['staff', 'admin','manage']);
const ProtectedProcessOrder = withRole(ProcessOrder, ['staff', 'admin','manage']);

const ProtectedBrandList = withRole(BrandList, ['admin','manage']);
const ProtectedAddNewBrand = withRole(AddNewBrand, ['admin','manage']);
const ProtectedUpdateBrand = withRole(UpdateBrand, ['admin','manage']);

const ProtectedBannerList = withRole(BannerList, ['admin','manage','staff']);
const ProtectedAddNewBanner = withRole(AddNewBanner, ['admin','manage','staff']);
const ProtectedUpdateBanner = withRole(UpdateBanner, ['admin','manage','staff']);

const ProtectedCategoryList = withRole(CategoryList, ['admin','manage']);
const ProtectedAddNewCategory = withRole(AddNewCategory, ['admin','manage']);
const ProtectedUpdateCategory = withRole(UpdateCategory, ['admin','manage']);

const ProtectedBlogCategoryList = withRole(BlogCategoryList, ['admin','manage']);
const ProtectedAddNewBlogCategory = withRole(AddNewBlogCategory, ['admin','manage']);
const ProtectedUpdateBlogCategory = withRole(UpdateBlogCategory, ['admin','manage']);

const ProtectedBlogList = withRole(BlogList, ['admin','manage','staff']);
const ProtectedAddNewBlog = withRole(AddNewBlog, ['admin','manage','staff']);
const ProtectedUpdateBlog = withRole(UpdateBlog, ['admin','manage','staff']);

const ProtectedProductList = withRole(ProductList, ['admin','manage','staff']);
const ProtectedAddNewProduct = withRole(AddNewProduct, ['admin','manage','staff']);
const ProtectedUpdateProduct = withRole(UpdateProduct, ['admin','manage','staff']);

const ProtectedReviewList = withRole(ReviewList, ['admin','manage','staff']);

const ProtectedUserList = withRole(UserList, ['admin']);
const ProtectedUpdateRole = withRole(UpdateRole, ['admin']);

const ProtectedLogList = withRole(LogList, ['admin']);
const ProtectedLogDetails = withRole(LogDetails, ['admin']);
function App() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector(selectLoggedInUser);
  const { persist } = useSelector(selectPersist);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        const { data } = await axiosPublic.get(`/refresh`);
        dispatch(refreshUserDetails(data));
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    }
    !accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
    return () => isMounted = false;
  }, [accessToken, dispatch, persist]);

  return (
    isLoading ? <BoxShadowLoader /> :
      <div className="App">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='collection/:id' element={<Products />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='blogs/:id' element={<Blog />} />
            <Route path='blog/:id' element={<BlogDetails />} />
            <Route path='auth' element={<Auth />} />
            <Route path='cart' element={<Cart />} />
            <Route path='google' element={<LoginSuccess />} />
            <Route path='forgotpassword' element={<ForgotPassword />} />
            <Route path='reset-password/:token' element={<ResetPassword />} />
            <Route path='/' element={<AuthenticatedRoute />}>
              <Route path='profile' element={<UserProfile />} />
              <Route path='/me/update' element={<UpdateProfile />} />
              <Route path='/password/update' element={<UpdatePassword />} />
              <Route path='/order/success/:id' element={<OrderSuccess />} />
              <Route path='/order' element={<MyOrders />} />
              <Route path='/order/:id' element={<OrderDetails />} />
              <Route path='unauthorized' element={<Unauthorized />} />
              <Route path='paymentsuccess' element={<PaymentSuccess />} />
            </Route>
            <Route path="*" element={
              <div style={{ textAlign: 'center' }}>
                <img src={notfound} alt='not found' width={400} />
              </div>
            } />
          </Route>
          <Route path='/authorized' element={<AuthorizedRoute />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='website' element={<ProtectedWebsite />} />
            <Route path='brand' element={<ProtectedAddNewBrand />} />
            <Route path='brandlist' element={<ProtectedBrandList />} />
            <Route path='brand/:id' element={<ProtectedUpdateBrand />} />
            <Route path='banner' element={<ProtectedAddNewBanner />} />
            <Route path='bannerlist' element={<ProtectedBannerList />} />
            <Route path='banner/:id' element={<ProtectedUpdateBanner />} />
            <Route path='category' element={<ProtectedAddNewCategory />} />
            <Route path='categorylist' element={<ProtectedCategoryList />} />
            <Route path='category/:id' element={<ProtectedUpdateCategory />} />
            <Route path='blogcategory' element={<ProtectedAddNewBlogCategory />} />
            <Route path='blogcategorylist' element={<ProtectedBlogCategoryList />} />
            <Route path='blogcategory/:id' element={<ProtectedUpdateBlogCategory />} />
            <Route path='blog' element={<ProtectedAddNewBlog />} />
            <Route path='bloglist' element={<ProtectedBlogList />} />
            <Route path='blog/:id' element={<ProtectedUpdateBlog />} />
            <Route path='product' element={<ProtectedAddNewProduct />} />
            <Route path='productlist' element={<ProtectedProductList />} />
            <Route path='product/:id' element={<ProtectedUpdateProduct />} />
            <Route path='orderlist' element={<ProtectedOrderList />} />
            <Route path='order/:id' element={<ProtectedProcessOrder />} />
            <Route path='reviewlist' element={<ProtectedReviewList />} />
            <Route path='userlist' element={<ProtectedUserList />} />
            <Route path='user/:id' element={<ProtectedUpdateRole />} />
            <Route path='loglist' element={<ProtectedLogList />} />
            <Route path='log/:id' element={<ProtectedLogDetails />} />
          </Route>
        </Routes>
      </div>
  );
}

export default App;
