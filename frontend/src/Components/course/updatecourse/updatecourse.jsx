import React, {useState, useEffect} from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Stack,InputLabel } from "@mui/material";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { Container, Paper, Avatar, Grid } from "@mui/material";
import { styled } from "@mui/system";
import Buttoncomponent from "../../form/common/button/button"
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import axiosInstancefile from "../../../Utils/axiosinstanceform"
import Loader from "../../common/loader/loader"
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../../Utils/axiosInstance";
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor: "#F4FBF8",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: "50%",
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "30%",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: "white",
  },
}));

const CenteredContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "130vh",
});

const Updatecourse = () => {
    const [categoryData, setCategortyData] = useState([]);
    const [categoryOpen, setCategoryOpen] = React.useState(false);
    const [typeData, setTypeData]=useState([])
    const categoryAnchorRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const [typeOpen, setTypeOpen] = React.useState(false);
    const typeAnchorRef = React.useRef(null);
    const [categoryId, setSelectedCategoryId] = useState(null);
    const [typeId, setSelectedTypeId] = useState(null);



    const handleCategoryItemClick = async (categoryId) => {
        await new Promise((resolve) => {
        setSelectedCategoryId(categoryId);
       
          handleCategoryClose(); 
          resolve()
        });
      };
      console.log("selectedCategoryId", categoryId);
      const handleTypeItemClick = async (typeId) => {
        await new Promise((resolve) => {
        setSelectedTypeId(typeId);
  
          handleTypeClose(); 
          resolve()
        });
      };
      console.log("selectedTypeId", typeId);
      
    useEffect(() => {
 const fetchData = async () => {
    try {

      const response = await axiosInstance.get(
        "/getallcategories"
      );
      console.log("All categories", response);
      setCategortyData(response.data.data.categories);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; 
    } 
  };
  if (categoryOpen) {
    fetchData();
  }
}, [categoryOpen]);
  console.log("categoryData",categoryData)

  const postData = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("categoryId", categoryId);
      formData.append("typeId", typeId);
  
      const response = await axiosInstancefile.post("/updatecourse", formData);
  
      console.log("Course updated", response);
      toast.success(response.data.message)
      return response;
    } catch (error) {
        toast.failure(error.response.data.message)
      console.error("Error updating course data:", error);
      throw error;
    }
  };
  
  const onSubmit = async (data) => {
    try {
      await postData(data); 
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  useEffect(() => {
    const fetchDataType = async () => {
       try {
        setLoading(true);
         const response = await axiosInstance.get(
           "/getalltypes"
         );
         console.log("All types", response.data.data.types);
         setTypeData(response.data.data.types);
         return response;
       } catch (error) {
         console.error("Error fetching data:", error);
         throw error;
       } finally{
        setLoading(false);
    }
     };
     if (typeOpen) {
        fetchDataType();
     }
   }, [typeOpen]);
     console.log("typeData",typeData)
  
    const handleCategoryToggle = () => {
        setCategoryOpen((prevOpen) => !prevOpen);
      };
    
      const handleCategoryClose = (event) => {
        if (event && categoryAnchorRef.current && categoryAnchorRef.current.contains(event.target)) {
          return;
        }
      
        setCategoryOpen(false);
      };
      
    
      const handleTypeToggle = () => {
        setTypeOpen((prevOpen) => !prevOpen);
      };
    
      const handleTypeClose = (event) => {
        if (event && typeAnchorRef.current && typeAnchorRef.current.contains(event.target)) {
          return;
        }
      
        setTypeOpen(false);
      };
      
      function handleListKeyDown(event, setOpen) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        } else if (event.key === 'Escape') {
          setOpen(false);
        }
      }
      const prevCategoryOpen = React.useRef(categoryOpen);
      React.useEffect(() => {
        if (prevCategoryOpen.current === true && categoryOpen === false) {
          categoryAnchorRef.current.focus();
        }
    
        prevCategoryOpen.current = categoryOpen;
      }, [categoryOpen]);
      const prevTypeOpen = React.useRef(typeOpen);
      React.useEffect(() => {
        if (prevTypeOpen.current === true && typeOpen === false) {
          typeAnchorRef.current.focus();
        }
    
        prevTypeOpen.current = typeOpen;
      }, [typeOpen]);
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }
  
      prevOpen.current = open;
    }, [open]);
    const {
      watch,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: "onChange" });
     return (
      <CenteredContainer>
        <StyledPaper elevation={6}>
          <Avatar src="/broken-image.jpg" style={{ marginBottom: 16 }} />
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <Grid container spacing={3} justifyContent="center" maxWidth="100%">
              <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required",
                }}
                render={({ field }) => (
                  <TextField
                    label="Title"
                    type="text"
                    placeholder="Enter Title"
                    {...field}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required",
                }}
                render={({ field }) => (
                  <TextField
                    label="Description"
                    type="text"
                    placeholder="Enter Description"
                    {...field}
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
            <div>
            <Button
                  ref={categoryAnchorRef}
                  id="category-button"
                  aria-controls={categoryOpen ? 'category-menu' : undefined}
                  aria-expanded={categoryOpen ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleCategoryToggle}
                >
                Category
                </Button>
                <Popper
                  open={categoryOpen}
                  anchorEl={categoryAnchorRef.current}
                  role={undefined}
                  placement="right-start"
                  transition
                  disablePortal
                >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper style={{ backgroundColor: 'white', marginRight: '30px' }}>
                <ClickAwayListener onClickAway={handleCategoryClose}>
                  <MenuList
                    autoFocusItem={categoryOpen}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={(event) => handleListKeyDown(event, setCategoryOpen)}
                  >
                   {categoryData.map((category) => (
                      <MenuItem key={category._id}  onClick={() => handleCategoryItemClick(category._id)}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

            </Grid>
            
            <Grid item xs={12}>
            <div>
            <Button
                  ref={typeAnchorRef}
                  id="type-button"
                  aria-controls={typeOpen ? 'type-menu' : undefined}
                  aria-expanded={typeOpen ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleTypeToggle}
                >
                  Type
                </Button>
                <Popper
                  open={typeOpen}
                  anchorEl={typeAnchorRef.current}
                  role={undefined}
                  placement="right-start"
                  transition
                  disablePortal
                >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper style={{ backgroundColor: 'white', marginRight: '60px' }}>
                <ClickAwayListener onClickAway={handleTypeClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={(event) => handleListKeyDown(event, setTypeOpen)}
                  >
                       {typeData.map((type) => (
                      <MenuItem key={type._id}  onClick={() => handleTypeItemClick(type._id)}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

            </Grid>         
          </Grid>
            <Buttoncomponent
              text={"Update course"}
              type={"submit"}
              variant={"contained"}
              style={{ marginTop: 16, backgroundColor: "#00695f" }}
            />
          </form>
        </StyledPaper>
      </CenteredContainer>
    );
  };
  
  export default Updatecourse;
  