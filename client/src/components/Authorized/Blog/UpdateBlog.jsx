import React,{useEffect,useState,useRef} from 'react';
import {useParams} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';

import {Box, Typography,TextField, Button,Grid,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import {getBlogs,blogDetails,selectBlogDetails,updateBlog, resetMutationResult, selectAllBlogAuthorizeRole, selectBlogMutationResult} from '../../../redux/features/blogSlice';

import { IMAGE_BASEURL } from '../../../constants/baseURL';
import PhotoIcon from '@mui/icons-material/Photo';
import JoditEditor from 'jodit-react';

const UpdateBlog = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const [blogStatus,setBlogStatus]=useState('');
    const [Image,setImage]=useState('');
    const [BlogImg,setBlogImg]=useState('');
    const [file,setFile]=useState('');
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

    const {loading, blog}=useSelector(selectBlogDetails);
    const {loading:isUdating, success}=useSelector(selectBlogMutationResult);
    const {blogs}=useSelector(selectAllBlogAuthorizeRole);

    const imageHandler=(e)=>{
      if(e.target.name==='BlogImg'){
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
        jsonData.append('blogStatus',blogStatus);

        if(file!==''){
          Object.keys(file).forEach(key=>{
            jsonData.append(file.item(key).name,file.item(key));
          })
        }
        dispatch(updateBlog({id,jsonData,toast}));
    }

    useEffect(() => {
        if(success){
            dispatch(resetMutationResult());
        }
        dispatch(blogDetails({id,toast}));
    }, [dispatch,id,success]);

    useEffect(() => {
        if(blog)
        {
            setTitle(blog.title);
            setDescription(blog.description);
            setBlogImg(blog?.ImageURL?.url)
            setBlogStatus(blog.blogStatus);
        }
      }, [blog]);
      
    
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
            
            <JoditEditor
            ref={editor}
            value={description}
            config={config}
            onChange={(newText)=>setDescription(newText)}
          />
             <Grid container style={{alignItems:'center',margin:'10px 0'}}>
                <Grid item xs>
                  <Box >
                    {Image===''? 
                      <img src={IMAGE_BASEURL+BlogImg} style={{height:'80px',width:'80px', borderRadius:'50%'}}/>
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

export default UpdateBlog