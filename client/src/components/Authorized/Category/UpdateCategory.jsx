import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

import {Box, Typography,TextField, Button,Grid,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import { categoryDetails, resetMutationResult, selectCategoryDetails, selectCategoryMutationResult, updateCategory,selectAllCategories } from '../../../redux/features/categorySlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import PhotoIcon from '@mui/icons-material/Photo';
const UpdateCategory = () => {
    const {id}=useParams();
    const dispatch=useDispatch();

    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [Image,setImage]=useState('');
    const [CategoryImg,setCategoryImg]=useState('');
    const [file,setFile]=useState('');



    const {loading, category}=useSelector(selectCategoryDetails);
    const {loading:isUdating, success}=useSelector(selectCategoryMutationResult);
    const {categories}=useSelector(selectAllCategories);

    const imageHandler=(e)=>{
      if(e.target.name==='logo'){
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
        jsonData.append('description',description);
        if(file!==''){
          Object.keys(file).forEach(key=>{
            jsonData.append(file.item(key).name,file.item(key));
          })
        }
        dispatch(updateCategory({id,jsonData,toast}));
    }

    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        }
        dispatch(categoryDetails({id,toast}));
    }, [dispatch,id,success]);

    useEffect(() => {
        if(category)
        {
            setTitle(category.title);
            setDescription(category.description);
            setCategoryImg(category?.CategoryImg?.url)
        }
      }, [category]);
      
    
  return (
    <>
    {loading ? <BoxShadowLoader/> :
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography component='div' variant='h5'>Update banner</Typography>
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
                        id='description'
                        label='Description'
                        name='description'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={description}
                        onChange={(e=>setDescription(e.target.value))}
            />
             <Grid container style={{alignItems:'center',margin:'10px 0'}}>
                <Grid item xs>
                  <Box >
                    {Image===''? 
                      <img src={IMAGE_BASEURL+CategoryImg} style={{height:'80px',width:'80px', borderRadius:'50%'}}/>
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
                            name='logo'
                            onChange={imageHandler}
                    />
                    Change Image
                  </Button>
                </Grid>
            </Grid>
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

export default UpdateCategory