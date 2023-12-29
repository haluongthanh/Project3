import React,{useEffect} from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {useDispatch,useSelector} from 'react-redux';
import {deleteBanner,getBanners, resetMutationResult, selectAllBanner, selectBannerMutationResult} from '../../../redux/features/bannerSlice';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import { IMAGE_BASEURL } from '../../../constants/baseURL';

import {Box, Typography,IconButton, Tooltip} from '@mui/material';
import DeleteForeeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

const BannerList = () => {
    const dispatch=useDispatch();
    const {loading, banners}=useSelector(selectAllBanner);
    const {success} = useSelector(selectBannerMutationResult);

    const deleteHandler=(id)=>{
        dispatch(deleteBanner({id,toast}));
    }

    const columns = [
        { field: 'title', headerName: 'Categories', headerClassName: 'gridHeader', flex: 1, minWidth: 170 },
        {
          field: 'img',
          headerName: 'img',
          headerClassName: 'gridHeader',
          flex: 1,
          minWidth: 170,
          renderCell: (params) => (
            <img
              src={IMAGE_BASEURL+params.value} // 'img' là tên trường, params.value sẽ chứa giá trị của trường 'img'
              alt="Banner"
              style={{ width: '100%', height: 'auto', maxWidth: '150px' }}
            />
          ),
        },
        { field: 'status', headerName: 'status', headerClassName: 'gridHeader', flex: 1.5, minWidth: 250 },
        {
          field: 'actions',
          headerName: 'Actions',
          headerClassName: 'gridHeader',
          flex: 0.5,
          minWidth: 80,
          type: 'number',
          sortable: false,
          renderCell: (params) => (
            <>
              <Link to={`/authorized/banner/${params.getValue(params.id, 'id')}`}>
                <Tooltip title="Edit" placement="top">
                  <EditIcon sx={{ width: '30px', height: '30px', color: '#1976d2' }} />
                </Tooltip>
              </Link>
      
              <Tooltip title="Delete" placement="top">
                <IconButton
                  color="error"
                  component="span"
                  onClick={() => deleteHandler(params.getValue(params.id, 'id'))}
                >
                  <DeleteForeeverIcon sx={{ width: '30px', height: '30px' }} />
                </IconButton>
              </Tooltip>
            </>
          ),
        },
      ];
    const rows=[];
    banners && banners.forEach(banner => {
        rows.push({
            id:banner._id,
            title:banner.title,
            img:banner?.ImageURL?.url,
            status:banner.bannerStatus
        })
    });
    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        } 
        dispatch(getBanners({toast}))
    }, [dispatch,success])
    
  return (
    <Box style={{displya:'flex', flexDirection:'column', width:'100%', marginTop:'15px', textAlign:'center'}}>
        <Typography component='h1' variant='h5'sx={{m:4}}>Full list of categories</Typography>
        {loading ? <BoxShadowLoader/>:
        <DataGrid rows={rows}
                    columns={columns}
                    components={{Toolbar:GridToolbar}}                    
                    autoHeight
        />
        }
    </Box>
  )
};

export default BannerList