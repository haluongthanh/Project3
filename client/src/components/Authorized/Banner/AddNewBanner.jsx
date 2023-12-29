import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {Box, Typography, TextField, Button, TextareaAutosize, Grid,  MenuItem, FormControl, Select, InputLabel} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import PhotoIcon from '@mui/icons-material/Photo';
import {addBanner,resetMutationResult,selectBannerMutationResult} from '../../../redux/features/bannerSlice';


const AddNewBanner = () => {
    const dispatch=useDispatch();
    const {loading,success}=useSelector(selectBannerMutationResult);
    const [title,setTitle]=useState('');
    const [LinkURL,setLinkURL]=useState('');
    const [bannerStatus,setbannerStatus]=useState('')
    const [Image,setImage]=useState('');
    const [ImageURL,setImageURL]=useState('');



    const imageHandler=(e)=>{
      if(e.target.name==='ImageURL'){
        setImageURL(e.target.files);
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
        Object.keys(ImageURL).forEach(key=>{
          jsonData.append(ImageURL.item(key).name,ImageURL.item(key));
        })

        dispatch(addBanner({jsonData,toast}));
    }
    useEffect(() => {
      
      if(success){
        dispatch(resetMutationResult());
        setTitle('');
        setLinkURL('');
        setbannerStatus('');
        setImage('');
        setImageURL('');
      }
    }, [success, dispatch]);
    
  return (
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography component='div' variant='h5'>Add new banner</Typography>
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
                      <InsertPhotoRoundedIcon sx={{height:'60px',width:'60px'}}/>
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
                    Change Image
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
                        disabled={loading?true:false}
                        variant='contained'
                        startIcon={<AddBoxOutlinedIcon/>}
                        sx={{mt:3,mb:2}}
            >Add Banner</Button>
        </Box>
    </Box>
  )
}

export default AddNewBanner