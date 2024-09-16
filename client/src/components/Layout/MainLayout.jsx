import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import React, { useLayoutEffect } from 'react';
import { selectWebsite, getWebsite } from '../../redux/features/websiteSlice';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
const MainLayout = () => {
    const dispatch = useDispatch();
    const { website } = useSelector(selectWebsite);
    useLayoutEffect(() => {
        if (website == undefined || !website || Object.keys(website).length === 0) {
            dispatch(getWebsite({ toast }));
        }
    }, [dispatch])

    if (website == undefined) {
        return <BoxShadowLoader />
    }


    return (
        <>

            <Header website={website} />
            <div className='wrapperMain_content'>
                <Outlet />
            </div>
            <Footer website={website}></Footer>

        </>
    )
}

export default MainLayout;