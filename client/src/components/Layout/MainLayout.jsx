import {Outlet} from 'react-router-dom';
import Header from './Header';

const MainLayout=()=>{
    return(
        <>
            <div className='site'>
                <Header/>
                <div className='wrapperMain_content'>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default MainLayout;