import React,{useState,useEffect,useRef} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {Box, Typography, TextField, Button, TextareaAutosize, Grid,  MenuItem, FormControl, Select, InputLabel} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import PhotoIcon from '@mui/icons-material/Photo';
import {addBlog,resetMutationResult,selectBlogMutationResult,selectAllBlog} from '../../../redux/features/blogSlice';

import JoditEditor from 'jodit-react';
const AddNewCategory = () => {
    const dispatch=useDispatch();
    const {loading,success}=useSelector(selectBlogMutationResult);
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [blogStatus,setBlogStatus]=useState('');
    const [Image,setImage]=useState('');
    const [BlogImg,setBlogImg]=useState('');
    const editor = useRef(null);
    const config = {
      zIndex: 0,
      readonly: false,
      activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
      toolbarButtonSize: 'middle',
      theme: 'default',
      enableDragAndDropFileToEditor: true,
      saveModeInCookie: false,
      spellcheck: true,
      editorCssClass: false,
      triggerChangeEvent: true,
      height: 500,
      direction: 'ltr',
      language: 'en',
      debugLanguage: false,
      i18n: 'en',
      tabIndex: -1,
      toolbar: true,
      enter: 'P',
      useSplitMode: false,
      colorPickerDefaultTab: 'background',
      imageDefaultWidth: 100,
      disablePlugins: ['paste', 'stat'],
      events: {},
      textIcons: false,
      uploader: {
        insertImageAsBase64URI: true
      },
      placeholder: '',
      showXPathInStatusbar: false
    };


    const imageHandler=(e)=>{
      if(e.target.name==='BlogImg'){
        setBlogImg(e.target.files);
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
        if(BlogImg===''){
          toast.warn('Please select a image');
          return false;
        }
        const jsonData=new FormData();
        jsonData.append('title',title);
        jsonData.append('description',description);
        jsonData.append('blogStatus',blogStatus);
        Object.keys(BlogImg).forEach(key=>{
          jsonData.append(BlogImg.item(key).name,BlogImg.item(key));
        })

        dispatch(addBlog({jsonData,toast}));
    }
    useEffect(() => {
      
      if(success){
        dispatch(resetMutationResult());
        setTitle('');
        setDescription('');
        setImage('');
        setBlogImg('');
      }
    }, [success, dispatch]);
    
  return (
    <Box sx={{marginTop:2, display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Typography component='div' variant='h5'>Add new blog</Typography>
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
                  <JoditEditor
            ref={editor}
            value={description}
            config={config}
            onChange={(newText)=>setDescription(newText)}
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
                            name='BlogImg'
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
                            value={blogStatus}
                            label='status'
                            onChange={(e=>setBlogStatus(e.target.value))}>

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