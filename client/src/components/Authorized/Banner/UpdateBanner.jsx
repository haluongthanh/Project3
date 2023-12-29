import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

import {Box, Typography,TextField, Button,Grid,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import { bannerDetails, resetMutationResult, selectBannerDetails, selectBannerMutationResult, updateBanner,selectAllBanner } from '../../../redux/features/bannerSlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import PhotoIcon from '@mui/icons-material/Photo';
const UpdateBanner = () => {
    const {id}=useParams();
    
    const dispatch=useDispatch();
   
    const [title,setTitle]=useState('');
    const [LinkURL,setLinkURL]=useState('');
    const [bannerStatus,setbannerStatus]=useState('')
    const [Image,setImage]=useState('');
    const [ImageURL,setImageURL]=useState('');
    const [file,setFile]=useState('');



    const {loading, banner}=useSelector(selectBannerDetails);
    const {loading:isUdating, success}=useSelector(selectBannerMutationResult);
    const {banners}=useSelector(selectAllBanner);

    const imageHandler=(e)=>{
      if(e.target.name==='ImageURL'){
        setFile(e.target.files);
        const reader=new FileReader();
        reader.onload=()=>{
          if(reader.readyState===2){
            setImage(reader.result);
          }
        }
        reader.readAsDataURL(e.target.files[0]);
      }
  }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const jsonData=new FormData();
        jsonData.append('title',title);
        jsonData.append('LinkURL',LinkURL);
        jsonData.append('bannerStatus',bannerStatus);
        if(file!==''){
            Object.keys(file).forEach(key=>{
              jsonData.append(file.item(key).name,file.item(key));
            })
          }
        dispatch(updateBanner({id,jsonData,toast}));
    }

    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        }
        dispatch(bannerDetails({id,toast}));
    }, [dispatch,id,success]);

    useEffect(() => {
        if(banner)
        {
            setTitle(banner.title);
            setLinkURL(banner.LinkURL);
            setbannerStatus(banner.bannerStatus)
            setImageURL(banner?.ImageURL?.url)
        }
      }, [banner]);
      
    
  return (
    <>
    {loading ? <BoxShadowLoader/> :
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography component='div' variant='h5'>Update category</Typography>
        <Box component='form' onSubmit={handleSubmit}>
        
            <TextField type='text'
                        id='title'
                        label='Title'
                        name='title'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={title}
                        onChange={(e=>setTitle(e.target.value))}
            />
            <TextField type='text'
                        id='LinkURL'
                        label='LinkURL'
                        name='LinkURL'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={LinkURL}
                        onChange={(e=>setLinkURL(e.target.value))}
            />
             <Grid container style={{alignItems:'center',margin:'10px 0'}}>
                <Grid item xs>
                  <Box >
                    {!Image? 
                      <img src={IMAGE_BASEURL+ImageURL} style={{height:'80px',width:'80px', borderRadius:'50%'}}/>
                      :
                      <img src={Image} style={{height:'80px',width:'80px', borderRadius:'50%'}}/>
                    }
                  </Box>
                </Grid>
                <Grid>
                  <Button fullWidth
                          variant='contained'
                          component='label'
                          startIcon={<PhotoIcon/>}
                  >
                    <input type='file' 
                            hidden
                            name='ImageURL'
                            onChange={imageHandler}
                    />
                    Change Profile Picture
                  </Button>
                </Grid>
            </Grid>
            <Box>
            <FormControl fullWidth>
                    <InputLabel id='status'>Select process</InputLabel>
                    <Select labelId='status'
                            id='status'
                            value={bannerStatus}
                            label='process'
                            onChange={(e=>setbannerStatus(e.target.value))}>
                               <MenuItem value='pause'>pause</MenuItem>
                               <MenuItem value='slide'>slide</MenuItem>
                               <MenuItem value='bottom'>bottom</MenuItem>
                               <MenuItem value='right'>right</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button type='submit'
                        fullWidth 
                        disabled={isUdating?true:false}                       
                        variant='contained'
                        startIcon={<UpdateIcon/>}
                        sx={{mt:3,mb:2}}
            >Update Banner</Button>
        </Box>
    </Box>
    }
    </>
  )
}

export default UpdateBanner