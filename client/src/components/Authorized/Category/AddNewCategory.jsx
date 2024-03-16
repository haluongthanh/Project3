import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {Box, Typography, TextField, Button, TextareaAutosize, Grid,  MenuItem, FormControl, Select, InputLabel} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import PhotoIcon from '@mui/icons-material/Photo';
import {addCategory,resetMutationResult,selectCategoryMutationResult,selectAllCategories} from '../../../redux/features/categorySlice';


const AddNewCategory = () => {
    const dispatch=useDispatch();
    const {loading,success}=useSelector(selectCategoryMutationResult);
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [categoryStatus,setCategoryStatus]=useState('');

    const [Image,setImage]=useState('');
    const [CategoryImg,setCategoryImg]=useState('');



    const imageHandler=(e)=>{
      if(e.target.name==='CategoryImg'){
        setCategoryImg(e.target.files);
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
        if(CategoryImg===''){
          toast.warn('Please select a image');
          return false;
        }
        const jsonData=new FormData();
        jsonData.append('title',title);
        jsonData.append('description',description);
        jsonData.append('categoryStatus',categoryStatus);
        Object.keys(CategoryImg).forEach(key=>{
          jsonData.append(CategoryImg.item(key).name,CategoryImg.item(key));
        })

        dispatch(addCategory({jsonData,toast}));
    }
    useEffect(() => {
      
      if(success){
        dispatch(resetMutationResult());
        setTitle('');
        setDescription('');
        setImage('');
        setCategoryImg('');
        setCategoryStatus('');
      }
    }, [success, dispatch]);
    
  return (
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography component='div' variant='h5'>Add new category</Typography>
        <Box component='form' onSubmit={handleSubmit}>
              {/* <Grid container spacing={2} sx={{mt:'4px'}}>
              <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id='category'>Parent Category</InputLabel>
                    <Select required
                            labelId='parent_category'
                            id='parent_category'
                            value={parent_category}
                            label='parent_category'
                            onChange={(e=>setParent(e.target.value))}>
                            <MenuItem value={"65680c1293b89e3dcbf1e29d"} >None</MenuItem>
                            
                            {categories && categories.map((cat)=>
                              
                              <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                              )
                            }
                    </Select>
                  </FormControl>
              </Grid>
              </Grid> */}
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
                            name='CategoryImg'
                            onChange={imageHandler}
                    />
                    Change Image
                  </Button>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <FormControl sx={{width:'100%'}}>
                    <InputLabel id='status'>Status</InputLabel>
                    <Select required
                            labelId='status'
                            id='status'
                            value={categoryStatus}
                            label='status'
                            onChange={(e=>setCategoryStatus(e.target.value))}> 
                                <MenuItem value='pause'>Pause</MenuItem>
                                <MenuItem value='active'>Active</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Button type='submit'
                        fullWidth
                        disabled={loading?true:false}
                        variant='contained'
                        startIcon={<AddBoxOutlinedIcon/>}
                        sx={{mt:3,mb:2}}
            >Add Category</Button>
        </Box>
    </Box>
  )
}

export default AddNewCategory